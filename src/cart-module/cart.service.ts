import {
  Injectable,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { Cart, CartItem } from './cart.model';
import { Product } from '../products/product.model';
import { AddToCartDto } from './dto/add-to-cart.dto';
import { UpdateCartDto } from './dto/update-cart.dto';
import { Sequelize } from 'sequelize-typescript';

@Injectable()
export class CartService {
  constructor(
    @InjectModel(Cart) private readonly cartModel: typeof Cart,
    @InjectModel(CartItem) private readonly cartItemModel: typeof CartItem,
    @InjectModel(Product) private readonly productModel: typeof Product,
    private readonly sequelize: Sequelize,
  ) {}

  // ================= ADD TO CART =================
  async addToCart(dto: AddToCartDto, userId?: number, guestId?: string) {
    if (!userId && !guestId) {
      throw new BadRequestException('UserId or GuestId is required');
    }

    const product = await this.productModel.findByPk(dto.productId);
    if (!product) throw new NotFoundException('Product not found');

    if (dto.quantity > product.stock) {
      throw new BadRequestException(
        `Only ${product.stock} items available`,
      );
    }

    const where: any = {};
    if (userId) where.userId = userId;
    if (guestId) where.guestId = guestId;

    let cart = await this.cartModel.findOne({ where });

    if (!cart) {
      cart = await this.cartModel.create({
  userId,
  guestId,
  totalPrice: 0,
});

    }

    const item = await this.cartItemModel.findOne({
      where: { cartId: cart.id, productId: product.id },
    });

    if (item) {
      const newQty = item.quantity + dto.quantity;
      if (newQty > product.stock) {
        throw new BadRequestException('Stock limit exceeded');
      }
      item.quantity = newQty;
      item.subtotal = newQty * item.price;
      await item.save();
    } else {
      await this.cartItemModel.create({
        cartId: cart.id,
        productId: product.id,
        name: product.name,
        price: Number(product.price),
        quantity: dto.quantity,
        subtotal: Number(product.price) * dto.quantity,
        image: product.image,
      });
    }

    await this.updateCartTotal(cart.id);

    return this.getCart(userId, guestId);
  }

  // ================= GET CART =================
  async getCart(userId?: number, guestId?: string) {
    const where: any = {};
    if (userId) where.userId = userId;
    if (guestId) where.guestId = guestId;

    const cart = await this.cartModel.findOne({
      where,
      include: [{ model: CartItem, as: 'items' }],
    });

    if (!cart) throw new NotFoundException('Cart is empty');
    return cart;
  }



  // ================= GET USER CART =================
  async getUserCart(userId: number) {
    const cart = await this.cartModel.findOne({
      where: { userId },
      include: [{ model: CartItem, as: 'items' }],
    });

    return cart ?? { items: [], totalPrice: 0 };



  }




  // ================= GET GUEST CART =================
  async getGuestCart(guestId: string) {
  const cart = await this.cartModel.findOne({
    where: { guestId },
    include: [{ model: CartItem, as: 'items' }],
  });

  if (!cart) {
    return {
      items: [],
      totalPrice: 0,
    };
  }

  return cart;
}




  // ================= UPDATE QUANTITY =================
  async updateQuantity(
    dto: UpdateCartDto,
    userId?: number,
    guestId?: string,
  ) {
    const where: any = {};
    if (userId) where.userId = userId;
    if (guestId) where.guestId = guestId;

    const cart = await this.cartModel.findOne({ where });
    if (!cart) throw new NotFoundException('Cart not found');

    const item = await this.cartItemModel.findOne({
      where: { cartId: cart.id, productId: dto.productId },
    });
    if (!item) throw new NotFoundException('Item not found');

    item.quantity = dto.quantity;
    item.subtotal = dto.quantity * item.price;
    await item.save();

    await this.updateCartTotal(cart.id);
    return this.getCart(userId, guestId);
  }

  // ================= REMOVE ITEM =================
  async removeItem(
    userId?: number,
    guestId?: string,
    productId?: number,
  ) {
    const where: any = {};
    if (userId) where.userId = userId;
    if (guestId) where.guestId = guestId;

    const cart = await this.cartModel.findOne({ where });
    if (!cart) throw new NotFoundException('Cart not found');

    await this.cartItemModel.destroy({
      where: { cartId: cart.id, productId },
    });

    await this.updateCartTotal(cart.id);
    return this.getCart(userId, guestId);
  }

  // ================= CLEAR CART =================
  async clearCart(userId?: number, guestId?: string) {
    const where: any = {};
    if (userId) where.userId = userId;
    if (guestId) where.guestId = guestId;

    const cart = await this.cartModel.findOne({ where });
    if (!cart) return { message: 'Cart already empty' };

    await this.cartItemModel.destroy({ where: { cartId: cart.id } });
    await cart.destroy();

    return { message: 'Cart cleared' };
  }

  // ================= MERGE GUEST CART =================
  async mergeGuestCart(userId: number, guestId: string) {
    return this.sequelize.transaction(async (t) => {
      const guestCart = await this.cartModel.findOne({
        where: { guestId },
        include: [{ model: CartItem, as: 'items' }],
        transaction: t,
      });

      if (!guestCart) return { message: 'No guest cart' };

      let userCart = await this.cartModel.findOne({
        where: { userId },
        transaction: t,
      });

      if (!userCart) {
        userCart = await this.cartModel.create(
          { userId, totalPrice: 0 },
          { transaction: t },
        );
      }

      for (const item of guestCart.items ?? []) {
        const exist = await this.cartItemModel.findOne({
          where: { cartId: userCart.id, productId: item.productId },
          transaction: t,
        });

        if (exist) {
          exist.quantity += item.quantity;
          exist.subtotal += item.subtotal;
          await exist.save({ transaction: t });
        } else {
          await this.cartItemModel.create(
            {
              cartId: userCart.id,
              productId: item.productId,
              name: item.name,
              price: item.price,
              quantity: item.quantity,
              subtotal: item.subtotal,
              image: item.image,
            },
            { transaction: t },
          );
        }
      }

      await this.cartItemModel.destroy({
        where: { cartId: guestCart.id },
        transaction: t,
      });
      await guestCart.destroy({ transaction: t });

      await this.updateCartTotal(userCart.id, t);

      return { message: 'Cart merged successfully' };
    });
  }

  // ================= HELPER =================
  private async updateCartTotal(cartId: number, transaction?: any) {
    const items = await this.cartItemModel.findAll({
      where: { cartId },
      transaction,
    });

    const total = items.reduce(
      (sum, i) => sum + Number(i.subtotal),
      0,
    );

    await this.cartModel.update(
      { totalPrice: total },
      { where: { id: cartId }, transaction },
    );
  }
}
