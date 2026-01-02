import { Module } from '@nestjs/common';
import { OrdersService } from './orders.service';
import { OrdersController } from './orders.controller';
import { SequelizeModule } from '@nestjs/sequelize';
import { Order } from './order.model';
import { OrderItem } from './order-item.model';
import { Cart } from '../Cart Module/cart.model';
import { CartItem } from '../Cart Module/cart.model';
import { AuthModule } from 'src/auth/auth.module';

@Module({
  imports: [SequelizeModule.forFeature([Order, OrderItem, Cart, CartItem]),

   AuthModule ,

],


 


  controllers: [OrdersController],
  providers: [OrdersService],
})
export class OrdersModule {}
