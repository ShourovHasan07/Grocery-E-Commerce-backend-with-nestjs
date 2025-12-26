// src/modules/auth/auth.controller.ts
import { Controller, Post, Body } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AdminLoginDto } from './dto/admin-login.dto';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

   @Post('admin/login')
  async adminLogin(@Body() body: AdminLoginDto) {
    return this.authService.adminLogin(body);
  }
}
