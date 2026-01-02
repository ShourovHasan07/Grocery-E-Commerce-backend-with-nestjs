// src/modules/admin/admin.module.ts
import { Module } from '@nestjs/common';
import { SequelizeModule } from '@nestjs/sequelize';
import { Cart, CartItem } from './cart.model';
import { CartController } from './cart.controller';
import { CartService } from './cart.service';

@Module({
  imports: [SequelizeModule.forFeature([Cart,CartItem])],
  controllers: [CartController],
  providers: [CartService],
})
export class CartModule {}
