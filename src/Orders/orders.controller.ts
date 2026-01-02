import { Controller, Post, Req, UseGuards } from '@nestjs/common';
import { OrdersService } from './orders.service';
import { AuthGuard } from '../auth/auth.guard';

@Controller('orders')
export class OrdersController {
  constructor(private readonly ordersService: OrdersService) {}

  @UseGuards(AuthGuard)
  @Post('checkout')
  checkout(@Req() req) {
    const userId = req.user.id; // payload from JWT
    return this.ordersService.checkout(userId);
  }
}
