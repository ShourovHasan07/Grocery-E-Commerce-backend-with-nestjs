// src/modules/admin/admin.module.ts
import { Module } from '@nestjs/common';
import { SequelizeModule } from '@nestjs/sequelize';
import { Admin } from './admin.model';
import { AdminService } from './admin.service';
import { AdminController } from './admin.controller';
import { AuthModule } from 'src/auth/auth.module';
import { AdminJwtAuthGuard } from 'src/auth/admin-jwt.guard';

@Module({
  imports: [SequelizeModule.forFeature([Admin]),AuthModule],
  controllers: [AdminController],
  providers: [AdminService,AdminJwtAuthGuard],
})
export class AdminModule {}
