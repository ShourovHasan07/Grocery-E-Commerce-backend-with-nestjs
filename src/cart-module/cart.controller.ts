import { Controller, Post, Get, Patch, Delete, Body, Param, Req, UseGuards, UnauthorizedException } from '@nestjs/common';
import { CartService } from './cart.service';
import { AddToCartDto } from './dto/add-to-cart.dto';
import { UpdateCartDto } from './dto/update-cart.dto';
import { AuthGuard } from '@nestjs/passport';

@Controller('cart')
// @UseGuards(AuthGuard('jwt'))
export class CartController {
  constructor(private readonly cartService: CartService) {}
//add to cart api
  @Post('add')
  addToCart(@Req() req, @Body() dto: AddToCartDto) {
    const userId = req.user?.id;
    const guestId = dto.guestId;
    return this.cartService.addToCart(dto, userId, guestId);
  }



  // ================= USER CART =================
  @UseGuards(AuthGuard('jwt'))
  @Get()
  getUserCart(@Req() req) {
    return this.cartService.getUserCart(req.user.id);
  }


   // ================= GUEST CART =================
  @Get('guest/:guestId')
  getGuestCart(@Param('guestId') guestId: string) {
    return this.cartService.getGuestCart(guestId);
  }


  @Get(':id')
  async getCart(@Param('id') id: string, @Req() req) {
    const userId = req.user?.id;
    const guestId = id;
    return await this.cartService.getCart(userId, guestId);
  }
//update cart api
  @Patch('update')
  updateCart(@Req() req, @Body() dto: UpdateCartDto) {
    const userId = req.user?.id;
    const guestId = dto.guestId
    return this.cartService.updateQuantity(dto, userId, guestId, );
  }
// remove item from cart api
  @Delete('remove/:productId/:id')
  removeItem(@Param('productId') productId: number, @Param('id') id: string, @Req() req) {
    const userId = req.user?.id;
    const guestId = id;
    return this.cartService.removeItem(userId, guestId, productId);
  }
// clear cart api
  @Delete('clear/:id')
  clearCart(@Param('id') id: string, @Req() req) {
    const userId = req.user?.id;
    const guestId = id;
    return this.cartService.clearCart(userId, guestId);
  }


// murge gustID to userid  Api 

 @Post("merge")
@UseGuards(AuthGuard('jwt'))
mergeCart(@Req() req, @Body("guestId") guestId: string) {
  const userId = req.user?.id;
  console.log("Merging cart for userId:", userId, "with guestId:", guestId);

  if (!userId) {
    throw new UnauthorizedException('User not authenticated');
  }

  return this.cartService.mergeGuestCart(userId, guestId);
}








}
