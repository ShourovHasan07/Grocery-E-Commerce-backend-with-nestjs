import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { Cart, CartItem } from './cart.model';
import { Product } from '../products/product.model';
import { AddToCartDto } from './dto/add-to-cart.dto';
import { UpdateCartDto } from './dto/update-cart.dto';

@Injectable()
export class CartService {

  // Add product to cart
 async addToCart(userId: number, dto: AddToCartDto) {
  

  // 1️ Product fetch
  const product = await Product.findByPk(dto.productId);
  if (!product) {
    
    throw new NotFoundException('Product not found');
  }
 

  const quantity = Number(dto.quantity);
  
  // 2 Stock check
 if (quantity > product.stock) {
    throw new BadRequestException(`Only ${product.stock} items are available in stock`);
  }

  //  Find or create cart
  let cart = await Cart.findOne({ where: { userId } });
  if (!cart) {
  
    cart = await Cart.create({ userId } as any);
  } 




  //  Find existing cart item
  let item = await CartItem.findOne({ where: { cartId: cart.id, productId: product.id } });

 if (item) {
    // before  add item update quantity
    const newQuantity = item.quantity + quantity;

    //  again  stock check
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
      image: product.image,
    } as any);
    
  }

  //  Update cart totalPrice
  
  await this.updateCartTotal(cart.id);

  //  Reload cart from DB to get updated totalPrice
  await cart.reload();
  //console.log('Cart after update:', { id: cart.id, totalPrice: cart.totalPrice });

  //  Get all items for response
  const items = await CartItem.findAll({ where: { cartId: cart.id } });
  

  
  return { cart, items };


  


}






  // Get cart with items
  async getCart(userId: number) {
    const cart = await Cart.findOne({
      where: { userId },
      include: [{ model: CartItem, as: 'items' }],
    });
    if (!cart) throw new NotFoundException('Cart is empty');
    return cart;
  }

  // Update item quantity
  async updateQuantity(userId: number, dto: UpdateCartDto) {
    const cart = await Cart.findOne({ where: { userId } });
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
  async removeItem(userId: number, productId: number) {
    const cart = await Cart.findOne({ where: { userId } });
    if (!cart) throw new NotFoundException('Cart not found');

    await CartItem.destroy({ where: { cartId: cart.id, productId } });

    await this.updateCartTotal(cart.id);

    const items = await CartItem.findAll({ where: { cartId: cart.id } });
    return { cart, items };
  }

  // Clear all items from cart
  async clearCart(userId: number) {
    const cart = await Cart.findOne({ where: { userId } });
    if (cart) {
      await CartItem.destroy({ where: { cartId: cart.id } });
      await cart.destroy();
    }
    return { message: 'Cart cleared' };
  }

  // Private helper to calculate and update cart total
  private async updateCartTotal(cartId: number) {
  const items = await CartItem.findAll({ where: { cartId } });
  const totalPrice = items.reduce((sum, i) => {
    
    return sum + Number(i.subtotal);
  }, 0);

  const cart = await Cart.findByPk(cartId);
  if (cart) {
    
    cart.totalPrice = totalPrice;
    await cart.save();
  }
}
}
