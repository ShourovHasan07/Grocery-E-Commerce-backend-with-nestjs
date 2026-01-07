import { Controller, Get, Query, UseGuards } from '@nestjs/common';
import { OrdersService } from './orders.service';
import { AdminGuard } from '../admin/admin.guard'; //  admin access

@Controller('admin/orders')
export class AdminOrdersController {
  constructor(private readonly ordersService: OrdersService) {}

  //@UseGuards(AdminGuard)
  @Get()
  getAllOrders(
    @Query('page') page = 1,
    @Query('limit') limit = 10,
    @Query('status') status?: string,
  ) {
    return this.ordersService.getAllOrdersForAdmin(Number(page), Number(limit), status);
  }
}
