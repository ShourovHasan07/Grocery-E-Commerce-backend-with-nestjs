import { Controller, Post, Get, Patch, Delete, Body, Param, Req, UseGuards, } from '@nestjs/common';
import { CartService } from './cart.service';
import { AddToCartDto } from './dto/add-to-cart.dto';
import { UpdateCartDto } from './dto/update-cart.dto';
import { AuthGuard } from '@nestjs/passport';

@Controller('cart')
@UseGuards(AuthGuard('jwt'))
export class CartController {
  constructor(private readonly cartService: CartService) {}

  @Post('add')
  addToCart(@Req() req, @Body() dto: AddToCartDto) {
    const userId = req.user.id; // Extract user ID from JWT Token 
    return this.cartService.addToCart(userId, dto);
  }

  @Get()
  getCart(@Req() req) {
    return this.cartService.getCart(req.user.id);
  }

  @Patch('update')
  updateCart(@Req() req, @Body() dto: UpdateCartDto) {
    return this.cartService.updateQuantity(req.user.id, dto);
  }

  @Delete('remove/:productId')
  removeItem(@Req() req, @Param('productId') productId: number) {
    return this.cartService.removeItem(req.user.id, productId);
  }

  @Delete('clear')
  clearCart(@Req() req) {
    return this.cartService.clearCart(req.user.id);
  }
}
