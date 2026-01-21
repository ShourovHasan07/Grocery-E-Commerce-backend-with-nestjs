// src/modules/payments/payments.service.ts
import { Injectable, BadRequestException } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { Payment } from './payments.model';
import axios from 'axios';
import qs from 'qs';
import { v4 as uuid } from 'uuid';
import { OrdersService } from '../Orders/orders.service';
import { CartService } from '../cart-module/cart.service';
import { PaymentStatus } from './payment-status.enum';
import { Order } from 'src/Orders/order.model';
import { OrderStatus } from 'src/Orders/order-status.enum';

@Injectable()
export class PaymentsService {
  constructor(
    @InjectModel(Payment)
    private paymentModel: typeof Payment,
    private ordersService: OrdersService,
    private cartService: CartService,
  ) {}

  //  Initiate Payment → create pending payment + SSLCommerz URL
  async initiatePayment(orderId: number): Promise<{ paymentUrl: string; transactionId: string }> {
    // Fetch order
    const order: Order | null = await this.ordersService.findById(orderId);
    if (!order) throw new BadRequestException('Order not found');
    if (order.status !== OrderStatus.PENDING) throw new BadRequestException('Order already paid or cancelled');

    const amount: number = order.totalPrice;
    if (amount <= 0) throw new BadRequestException('Invalid order amount');

    // Prevent double payment
    const alreadyPaid = await this.paymentModel.findOne({
      where: { orderId, status: PaymentStatus.SUCCESS },
    });
    if (alreadyPaid) throw new BadRequestException('Order already paid');

    // Create transaction
    const transactionId: string = 'TXN_' + uuid();
    await this.paymentModel.create({
      orderId,
      transactionId,
      method: 'SSLCommerz',
      status: PaymentStatus.INITIATED,
      amount,
      currency: 'BDT',
    });

    // SSLCommerz payload
    const payload = {
  store_id: process.env.SSL_STORE_ID,
  store_passwd: process.env.SSL_STORE_PASS,
  total_amount: amount,
  currency: 'BDT',
  tran_id: transactionId,

  // URLs
  success_url: `${process.env.FRONTEND_URL}/success`,
  fail_url: `${process.env.FRONTEND_URL}/payments/fail`,
  cancel_url: `${process.env.FRONTEND_URL}/payments/cancel`,

  // Customer Info (required)
  cus_name: 'Customer',
  cus_email: 'customer@example.com',
  cus_phone: '01700000000',
  cus_add1: 'House 123, Road 4',
  cus_add2: 'Banani',
  cus_city: 'Dhaka',
  cus_state: 'Dhaka',
  cus_postcode: '1213',
  cus_country: 'Bangladesh',

  // Product Info
  product_name: 'Ecommerce Order',
  product_category: 'General',
  product_profile: 'general',   //  Required
  shipping_method: 'NO',
};

    // Make axios POST call (form-urlencoded)
    try {
      const response = await axios.post(
        'https://sandbox.sslcommerz.com/gwprocess/v4/api.php',
        qs.stringify(payload),
        { headers: { 'Content-Type': 'application/x-www-form-urlencoded' } },
      );

      if (!response.data?.GatewayPageURL) {
        console.error('SSLCommerz Response:', response.data);
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
  async handleSuccess(tran_id: string): Promise<{ message: string }> {
    const payment = await this.paymentModel.findOne({
      where: { transactionId: tran_id },
      include: [Order],
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
  async handleFail(tran_id: string): Promise<{ message: string }> {
    const payment = await this.paymentModel.findOne({ where: { transactionId: tran_id } });
    if (!payment) throw new BadRequestException('Payment not found');

    payment.status = PaymentStatus.FAILED;
    await payment.save();

    await this.ordersService.cancelOrder(payment.orderId);

    return { message: 'Payment Failed, order cancelled' };
  }

  //  Handle Cancel → update payment + cancel order
  async handleCancel(tran_id: string): Promise<{ message: string }> {
    const payment = await this.paymentModel.findOne({ where: { transactionId: tran_id } });
    if (!payment) throw new BadRequestException('Payment not found');

    payment.status = PaymentStatus.CANCELLED;
    await payment.save();

    await this.ordersService.cancelOrder(payment.orderId);

    return { message: 'Payment Cancelled, order cancelled' };
  }
}
