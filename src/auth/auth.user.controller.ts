// src/modules/auth/auth-user.controller.ts
import { Controller, Post, Body } from '@nestjs/common';
import { AuthUserService } from './auth.user.service';
import { ClerkLoginDto } from './dto/clerk-login.dto';

@Controller('auth/user')
export class AuthUserController {
  constructor(private readonly authUserService: AuthUserService) {}

  @Post('clerk-login')
  async clerkLogin(@Body() body: ClerkLoginDto) {
    return this.authUserService.clerkLogin(body);
  }
}
