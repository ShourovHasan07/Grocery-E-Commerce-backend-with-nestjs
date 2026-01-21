import { Module } from '@nestjs/common';
import { OrdersService } from './orders.service';
import { OrdersController } from './orders.controller';
import { SequelizeModule } from '@nestjs/sequelize';
import { Order } from './order.model';
import { OrderItem } from './order-item.model';
import { Cart } from '../cart-module/cart.model';
import { CartItem } from '../cart-module/cart.model';
import { AuthModule } from 'src/auth/auth.module';

@Module({
  imports: [SequelizeModule.forFeature([Order, OrderItem, Cart, CartItem]),

   AuthModule ,

],


 


  controllers: [OrdersController],
  providers: [OrdersService],


   exports: [OrdersService],




})
export class OrdersModule {}
