import { Injectable, BadRequestException, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { Order } from './order.model';
import { OrderItem } from './order-item.model';
import { Cart } from '../Cart Module/cart.model';
import { CartItem } from '../Cart Module/cart.model';
import { OrderStatus } from './order-status.enum';

@Injectable()
export class OrdersService {
  constructor(
    @InjectModel(Order) private orderModel: typeof Order,
    @InjectModel(OrderItem) private orderItemModel: typeof OrderItem,
    @InjectModel(Cart) private cartModel: typeof Cart,
    @InjectModel(CartItem) private cartItemModel: typeof CartItem,
  ) {}


  //  Find order by ID (used by PaymentsService)
async findById(orderId: number) {
  return this.orderModel.findByPk(orderId);
}





  //  STEP 1: Checkout → Create Order (PENDING)
  async checkout(userId: number) {
    const cart = await this.cartModel.findOne({
      where: { userId },
      include: [CartItem],
    });

    if (!cart || !cart.items || cart.items.length === 0) {
      throw new BadRequestException('Cart is empty');
    }

    const order = await this.orderModel.create({
      userId,
      totalPrice: cart.totalPrice,
      status: OrderStatus.PENDING,
    });

    for (const item of cart.items) {
      await this.orderItemModel.create({
        orderId: order.id,
        productId: item.productId,
        name: item.name,
        price: item.price,
        quantity: item.quantity,
        subtotal: item.subtotal,
      });
    }

    return {
      message: 'Order created. Proceed to payment.',
      orderId: order.id,
      amount: cart.totalPrice,
      status: order.status,
    };
  }

  //  STEP 2: Payment Success → Confirm Order
  async confirmPaymentSuccess(orderId: number, userId: number) {
    const order = await this.orderModel.findByPk(orderId);

    if (!order) {
      throw new BadRequestException('Order not found');
    }

    if (order.status !== OrderStatus.PENDING) {
      throw new BadRequestException('Order already processed');
    }

    // Update order status
    order.status = OrderStatus.PAID;
    await order.save();

    // Clear cart AFTER payment success
    const cart = await this.cartModel.findOne({ where: { userId } });
    if (cart) {
      await this.cartItemModel.destroy({ where: { cartId: cart.id } });
      cart.totalPrice = 0;
      await cart.save();
    }

    return {
      message: 'Payment confirmed, order placed successfully',
      orderId: order.id,
      status: order.status,
    };
  }

  //  Optional: Payment Failed
  async cancelOrder(orderId: number) {
    await this.orderModel.update(
      { status: OrderStatus.CANCELLED },
      { where: { id: orderId } },
    );
  }



   
  //  all orders  (Pagination + Filter optional)
  async getAllOrders(page = 1, limit = 10, userId?: number) {
    const offset = (page - 1) * limit;
    const where: any = {};

    if (userId) {
      where.userId = userId; //  user     orders
    }

    const { rows, count } = await this.orderModel.findAndCountAll({
      where,
      include: [OrderItem],  
      order: [['createdAt', 'DESC']], // newest first
      limit,
      offset,
    });

    return {
      orders: rows,
      totalOrders: count,
      page,
      totalPages: Math.ceil(count / limit),
    };
  }

  // =========================
  //  Order by ID (Detail view)
  async getOrderById(orderId: number) {
    const order = await this.orderModel.findByPk(orderId, {
      include: [OrderItem],
    });

    if (!order) {
      throw new NotFoundException('Order not found');
    }

    return order;
  }




  

async getAllOrdersForAdmin(page = 1, limit = 10, status?: string) {
  const offset = (page - 1) * limit;

  const where: any = {};
  if (status) {
    where.status = status; // Optional: filter by status
  }

  const { rows, count } = await this.orderModel.findAndCountAll({
    where,
    include: [OrderItem], // relation with items
    order: [['createdAt', 'DESC']], // newest first
    limit,
    offset,
  });

  return {
    orders: rows,
    totalOrders: count,
    page,
    totalPages: Math.ceil(count / limit),
  };
}








}
