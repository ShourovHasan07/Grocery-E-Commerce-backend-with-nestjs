// src/modules/dashboard/dashboard.controller.ts
import { Controller, Get, UseGuards } from '@nestjs/common';
import { DashboardService } from './dashboard.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { AdminGuard } from '../admin/admin.guard';
import { AdminJwtAuthGuard } from 'src/auth/admin-jwt.guard';

@Controller('admin/dashboard')
@UseGuards(AdminJwtAuthGuard) // only  Admin
export class DashboardController {
  constructor(private readonly dashboardService: DashboardService) {}

  @Get('stats')
  async getStats() {
    return await this.dashboardService.getDashboardStats();
  }
}
