import { Module } from '@nestjs/common';
import { SequelizeModule } from '@nestjs/sequelize';
import { databaseConfig } from './config/database.config';

import { UsersModule } from './users/users.module';
//import { AuthModule } from './auth/auth.module';
//import { AdminModule } from './admin/admin.module';
//import { CarsModule } from './cars/cars.module';
//import { BookingModule } from './bookings/booking.module';
//import { PaymentsModule } from './payments/payments.module';
//import { DashboardModule } from './dashboard/dashboard.module';

@Module({
  imports: [
    SequelizeModule.forRoot(databaseConfig),

    UsersModule,
    
  ],
})
export class AppModule {}
