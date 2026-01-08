// src/modules/dashboard/dashboard.module.ts
import { Module } from '@nestjs/common';
import { SequelizeModule } from '@nestjs/sequelize';
import { DashboardService } from './dashboard.service';
import { DashboardController } from './dashboard.controller';
import { Order } from '../Orders/order.model';
import { OrderItem } from '..//Orders/order-item.model';
import { User } from '../users/user.model';
import { Product } from '../products/product.model';

@Module({
  imports: [SequelizeModule.forFeature([Order, OrderItem, User, Product])],
  controllers: [DashboardController],
  providers: [DashboardService],
})
export class DashboardModule {}
