import { Controller, Post, Get, Patch, Delete, Body, Param, Req, UseGuards } from '@nestjs/common';
import { CartService } from './cart.service';
import { AddToCartDto } from './dto/add-to-cart.dto';
import { UpdateCartDto } from './dto/update-cart.dto';
import { AuthGuard } from '@nestjs/passport';

@Controller('cart')
// @UseGuards(AuthGuard('jwt'))
export class CartController {
  constructor(private readonly cartService: CartService) {}

  @Post('add')
  addToCart(@Req() req, @Body() dto: AddToCartDto) {
    const userId = req.user?.id;
    const guestId = dto.guestId;
    return this.cartService.addToCart(dto, userId, guestId);
  }

  @Get(':id')
  async getCart(@Param('id') id: string, @Req() req) {
    const userId = req.user?.id;
    const guestId = id;
    return await this.cartService.getCart(userId, guestId);
  }

  @Patch('update')
  updateCart(@Req() req, @Body() dto: UpdateCartDto) {
    const userId = req.user?.id;
    const guestId = dto.guestId
    return this.cartService.updateQuantity(dto, userId, guestId, );
  }

  @Delete('remove/:productId/:id')
  removeItem(@Param('productId') productId: number, @Param('id') id: string, @Req() req) {
    const userId = req.user?.id;
    const guestId = id;
    return this.cartService.removeItem(userId, guestId, productId);
  }

  @Delete('clear/:id')
  clearCart(@Param('id') id: string, @Req() req) {
    const userId = req.user?.id;
    const guestId = id;
    return this.cartService.clearCart(userId, guestId);
  }


// murge gustID to userid  Api 

  @UseGuards(AuthGuard) // only logged-in user
  @Post("merge")
  mergeCart(@Req() req, @Body("guestId") guestId: string) {
    const userId = req.user.id;
    return this.cartService.mergeGuestCart(userId, guestId);
  }







}
