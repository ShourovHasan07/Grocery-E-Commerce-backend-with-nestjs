import { Module } from '@nestjs/common';
import { SequelizeModule } from '@nestjs/sequelize';
import { Payment } from './payments.model';
import { PaymentsService } from './payments.service';
import { PaymentsController } from './payments.controller';
import { OrdersModule } from '../Orders/orders.module';
import { CartModule } from 'src/cart-module/cart.module';

@Module({
  imports: [
    SequelizeModule.forFeature([Payment]),
    OrdersModule,
    CartModule,


  ],
  providers: [PaymentsService],
  controllers: [PaymentsController],
})
export class PaymentsModule {}
