import { Module } from '@nestjs/common';
import { SequelizeModule } from '@nestjs/sequelize';
import { ConfigModule } from '@nestjs/config';

import { databaseConfig } from './config/database.config';
import { UsersModule } from './users/users.module';
import { AuthModule } from './auth/auth.module';
import { AdminModule } from './admin/admin.module';
import { ProductModule } from './products/product.module';
import { CartModule } from './Cart Module/cart.module';
import { OrdersModule } from './Orders/orders.module';


@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),

    SequelizeModule.forRoot(databaseConfig),

    UsersModule,
    AuthModule,
    AdminModule,
    ProductModule,
    CartModule,
    OrdersModule,
  ],
})
export class AppModule {}
