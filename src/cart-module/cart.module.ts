// src/modules/admin/admin.module.ts
import { Module } from '@nestjs/common';
import { SequelizeModule } from '@nestjs/sequelize';
import { Cart, CartItem } from './cart.model';
import { CartController } from './cart.controller';
import { CartService } from './cart.service';
import { Product } from 'src/products/product.model';

@Module({
  imports: [SequelizeModule.forFeature([Cart,CartItem,Product])],
  controllers: [CartController],
  providers: [CartService],
  exports: [CartService],
})
export class CartModule {}
  