// src/modules/payments/payments.service.ts
import { Injectable, BadRequestException } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { Payment } from './payments.model';
import axios from 'axios';
import { v4 as uuid } from 'uuid';
import { OrdersService } from '../Orders/orders.service';
import { CartService } from '../Cart Module/cart.service';
import { PaymentStatus } from './payment-status.enum';
import { Order } from 'src/Orders/order.model';
import { OrderStatus } from 'src/Orders/order-status.enum';

@Injectable()
export class PaymentsService {
  constructor(
    @InjectModel(Payment)
    private paymentModel: typeof Payment,
    private ordersService: OrdersService,
    private cartService: CartService
  ) {}

  

  //  Initiate Payment → create pending payment + SSLCommerz URL
async initiatePayment(orderId: number) {

  // 1️⃣ Fetch order
  const order = await this.ordersService.findById(orderId);

  if (!order) {
    throw new BadRequestException('Order not found');
  }

  if (order.status !== OrderStatus.PENDING) {
    throw new BadRequestException('Order already paid or cancelled');
  }

  const amount = order.totalPrice;

  if (amount <= 0) {
    throw new BadRequestException('Invalid order amount');
  }

  // 2️⃣ Prevent double payment
  const alreadyPaid = await this.paymentModel.findOne({
    where: {
      orderId,
      status: PaymentStatus.SUCCESS,
    },
  });

  if (alreadyPaid) {
    throw new BadRequestException('Order already paid');
  }

  // 3️⃣ Create transaction
  const transactionId = 'TXN_' + uuid();

  await this.paymentModel.create({
    orderId,
    transactionId,
    method: 'SSLCommerz',
    status: PaymentStatus.INITIATED,
    amount,
    currency: 'BDT',
  });

  // 4️⃣ SSLCommerz payload (recommended fields)
  const payload = {
    store_id: process.env.SSL_STORE_ID,
    store_passwd: process.env.SSL_STORE_PASS,
    total_amount: amount,
    currency: 'BDT',
    tran_id: transactionId,

    success_url: `${process.env.BASE_URL}/payments/success`,
    fail_url: `${process.env.BASE_URL}/payments/fail`,
    cancel_url: `${process.env.BASE_URL}/payments/cancel`,

    cus_name: 'Customer',
    cus_email: 'customer@example.com',
    cus_phone: '01700000000',

    product_name: 'Ecommerce Order',
    product_category: 'General',
    shipping_method: 'NO',
  };

  try {
    const response = await axios.post(
      'https://sandbox.sslcommerz.com/gwprocess/v3/api.php',
      payload,
      { headers: { 'Content-Type': 'application/x-www-form-urlencoded' } }
    );

    if (!response.data?.GatewayPageURL) {
      throw new BadRequestException('Invalid payment gateway response');
    }

    return {
      paymentUrl: response.data.GatewayPageURL,
      transactionId,
    };
  } catch (error: any) {
    console.error('SSLCommerz API Error:', error.response?.data || error.message);
    throw new BadRequestException('Payment initialization failed');
  }
}






  //  Handle Success → update payment + order + clear cart
  async handleSuccess(tran_id: string, ) {
    const payment = await this.paymentModel.findOne({
        
        where: { transactionId: tran_id },

        include: [Order], // Payment → Order relation load
    
    
    });
    if (!payment) throw new BadRequestException('Payment not found');

    payment.status = PaymentStatus.SUCCESS;
    await payment.save();

    const userId = payment.order.userId;

    // Update Order status
    await this.ordersService.confirmPaymentSuccess(payment.orderId, userId);

    // Clear User Cart
    await this.cartService.clearCart(userId);

    return { message: 'Payment Success, order placed, cart cleared' };
  }

  //  Handle Fail → update payment + cancel order
  async handleFail(tran_id: string) {
    const payment = await this.paymentModel.findOne({ where: { transactionId: tran_id } });
    if (!payment) throw new BadRequestException('Payment not found');

    payment.status = PaymentStatus.FAILED;
    await payment.save();

    await this.ordersService.cancelOrder(payment.orderId);

    return { message: 'Payment Failed, order cancelled' };
  }

  //  Handle Cancel → update payment + cancel order
  async handleCancel(tran_id: string) {
    const payment = await this.paymentModel.findOne({ where: { transactionId: tran_id } });
    if (!payment) throw new BadRequestException('Payment not found');

   payment.status = PaymentStatus.CANCELLED;
await payment.save();

    await payment.save();

    await this.ordersService.cancelOrder(payment.orderId);

    return { message: 'Payment Cancelled, order cancelled' };
  }
}
