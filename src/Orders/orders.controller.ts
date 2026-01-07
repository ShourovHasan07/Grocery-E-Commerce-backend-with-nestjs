import { Controller, Get, Param, ParseIntPipe, Post, Query, Req, UseGuards } from '@nestjs/common';
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





  
  // GET all orders 
 
  @Get()
  getAllOrders(
    @Query('page') page = 1,
    @Query('limit') limit = 10,
    @Req() req,
  ) {
    //  userId  user order 
    const userId = req.user?.id; 
    return this.ordersService.getAllOrders(Number(page), Number(limit), userId);
  }



  
  // GET order by ID
  @UseGuards(AuthGuard)
  @Get(':id')
  getOrderById(@Param('id', ParseIntPipe) id: number, @Req() req) {
    // Optional: check if user owns this order or is admin
    return this.ordersService.getOrderById(id);
  }







}
