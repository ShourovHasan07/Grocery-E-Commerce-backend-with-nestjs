import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { Cart, CartItem } from './cart.model';
import { Product } from '../products/product.model';
import { AddToCartDto } from './dto/add-to-cart.dto';
import { UpdateCartDto } from './dto/update-cart.dto';

@Injectable()
export class CartService {

  // Add product to cart
  async addToCart(dto: AddToCartDto, userId?: number, guestId?: string) {
    const product = await Product.findByPk(dto.productId);
    if (!product) throw new NotFoundException('Product not found');

    const quantity = Number(dto.quantity);
    if (quantity > product.stock) {
      throw new BadRequestException(`Only ${product.stock} items are available in stock`);
    }

    // Build safe where condition
    const whereCondition: any = {};
    if (userId) whereCondition.userId = userId;
    if (guestId) whereCondition.guestId = guestId;

    if (!userId && !guestId) {
      throw new BadRequestException('UserId or GuestId is required');
    }

    // Find or create cart
   let cart = await Cart.findOne({ where: whereCondition });
if (!cart) {
  cart = Cart.build({
    ...(userId ? { userId } : {}),
    ...(guestId ? { guestId } : {}),
  } as any); // TypeScript error gone
  await cart.save();
}


    // Find existing cart item
    let item = await CartItem.findOne({ where: { cartId: cart.id, productId: product.id } });
    if (item) {
      const newQuantity = item.quantity + quantity;
      if (newQuantity > product.stock) {
        throw new BadRequestException(`Only ${product.stock} items are available in stock`);
      }
      item.quantity = newQuantity;
      item.subtotal = item.quantity * item.price;
      await item.save();
    } else {
      item = await CartItem.create({
        cartId: cart.id,
        productId: product.id,
        name: product.name,
        price: Number(product.price),
        quantity: quantity,
        subtotal: Number(product.price) * quantity,
        image: product.image ?? '', // null safe
      }as any );
    }

    await this.updateCartTotal(cart.id);
    await cart.reload();

    const items = await CartItem.findAll({ where: { cartId: cart.id } });
    return { cart, items };
  }

  // Get cart with items
  async getCart(userId?: number, guestId?: string) {
    const whereCondition: any = {};
    if (userId) whereCondition.userId = userId;
    if (guestId) whereCondition.guestId = guestId;

    if (!userId && !guestId) throw new BadRequestException('UserId or GuestId is required');

    const cart = await Cart.findOne({
      where: whereCondition,
      include: [{ model: CartItem, as: 'items' }],
    });

    if (!cart) throw new NotFoundException('Cart is empty');
    return cart;
  }

  // Update item quantity
  async updateQuantity(dto: UpdateCartDto, userId?: number, guestId?: string) {
    const whereCondition: any = {};
    if (userId) whereCondition.userId = userId;
    if (guestId) whereCondition.guestId = guestId;

    if (!userId && !guestId) throw new BadRequestException('UserId or GuestId is required');

    const cart = await Cart.findOne({ where: whereCondition });
    if (!cart) throw new NotFoundException('Cart not found');

    const item = await CartItem.findOne({ where: { cartId: cart.id, productId: dto.productId } });
    if (!item) throw new NotFoundException('Item not found');

    const quantity = Number(dto.quantity);
    item.quantity = quantity;
    item.subtotal = Number(item.price) * quantity;
    await item.save();

    await this.updateCartTotal(cart.id);
    const items = await CartItem.findAll({ where: { cartId: cart.id } });
    return { cart, items };
  }

  // Remove item from cart
  async removeItem(userId?: number, guestId?: string, productId?: number) {
    const whereCondition: any = {};
    if (userId) whereCondition.userId = userId;
    if (guestId) whereCondition.guestId = guestId;

    if (!userId && !guestId) throw new BadRequestException('UserId or GuestId is required');

    const cart = await Cart.findOne({ where: whereCondition });
    if (!cart) throw new NotFoundException('Cart not found');

    await CartItem.destroy({ where: { cartId: cart.id, productId } });
    await this.updateCartTotal(cart.id);

    const items = await CartItem.findAll({ where: { cartId: cart.id } });
    return { cart, items };
  }

  // Clear all items from cart
  async clearCart(userId?: number, guestId?: string) {
    const whereCondition: any = {};
    if (userId) whereCondition.userId = userId;
    if (guestId) whereCondition.guestId = guestId;

    if (!userId && !guestId) throw new BadRequestException('UserId or GuestId is required');

    const cart = await Cart.findOne({ where: whereCondition });
    if (cart) {
      await CartItem.destroy({ where: { cartId: cart.id } });
      await cart.destroy();
    }
    return { message: 'Cart cleared' };
  }

  // Private helper to calculate and update cart total
  private async updateCartTotal(cartId: number) {
    const items = await CartItem.findAll({ where: { cartId } });
    const totalPrice = items.reduce((sum, i) => sum + Number(i.subtotal), 0);
    const cart = await Cart.findByPk(cartId);
    if (cart) {
      cart.totalPrice = totalPrice;
      await cart.save();
    }
  }



// Merge guest cart into user cart
async mergeGuestCart(userId: number, guestId: string) {
  // 1. find guest cart
  const guestCart = await this.cartModel.findOne({
    where: { guestId },
    include: [CartItem],
  });

  if (!guestCart) return; // Nothing to merge

  // 2. find user cart
  let userCart = await this.cartModel.findOne({ where: { userId } });
  if (!userCart) {
    userCart = await this.cartModel.create({ userId, totalPrice: 0 });
  }

  // 3. merge items
  for (const item of guestCart.items) {
    const existingItem = await this.cartItemModel.findOne({
      where: { cartId: userCart.id, productId: item.productId },
    });

    if (existingItem) {
      existingItem.quantity += item.quantity;
      existingItem.subtotal += item.subtotal;
      await existingItem.save();
    } else {
      await this.cartItemModel.create({
        cartId: userCart.id,
        productId: item.productId,
        name: item.name,
        price: item.price,
        quantity: item.quantity,
        subtotal: item.subtotal,
      });
    }
  }

  // 4. update totalPrice
  userCart.totalPrice += guestCart.totalPrice;
  await userCart.save();

  // 5. delete guest cart
  await this.cartItemModel.destroy({ where: { cartId: guestCart.id } });
  await this.cartModel.destroy({ where: { id: guestCart.id } });

  return { message: 'Cart merged successfully' };
}




}
