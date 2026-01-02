import { Injectable, BadRequestException } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { Order } from './order.model';
import { OrderItem } from './order-item.model';
import { Cart } from '../Cart Module/cart.model';
import { CartItem } from '../Cart Module/cart.model'; // Correct import
import { OrderStatus } from './order-status.enum';

@Injectable()
export class OrdersService {
  constructor(
    @InjectModel(Order) private orderModel: typeof Order,
    @InjectModel(OrderItem) private orderItemModel: typeof OrderItem,
    @InjectModel(Cart) private cartModel: typeof Cart,
    @InjectModel(CartItem) private cartItemModel: typeof CartItem,
  ) {}

  async checkout(userId: number) {
    // Fetch Cart with Items
    const cart = await this.cartModel.findOne({
      where: { userId },
      include: [CartItem],
    });

    //  Validate Cart
    if (!cart || !cart.items || cart.items.length === 0) {
      throw new BadRequestException('Cart is empty');
    }

    //  Create Order
    const order = await this.orderModel.create({
      userId,
      totalPrice: cart.totalPrice,
      status: OrderStatus.PENDING,
    });

    //  Create Order Items
    for (const item of cart.items ?? []) {
      await this.orderItemModel.create({
        orderId: order.id,
        productId: item.productId,
        name: item.name,
        price: item.price,
        quantity: item.quantity,
        subtotal: item.subtotal,
      });
    }

    //  Clear Cart
    await this.cartItemModel.destroy({ where: { cartId: cart.id } });
    cart.totalPrice = 0;
    await cart.save();

    //  Return Response
    return {
      message: 'Order placed successfully',
      orderId: order.id,
      status: order.status,
    };
  }
}
