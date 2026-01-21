import { Controller, Post, Body } from '@nestjs/common';
import { AuthUserService } from './auth.user.service';

@Controller('auth')
export class AuthUserController {
  constructor(private readonly authUserService: AuthUserService) {}

  @Post('send-otp')
  async sendOtp(@Body('identifier') identifier: string) {
    return this.authUserService.sendOtp(identifier);
  }

  @Post('verify-otp')
  async verifyOtp(@Body() body: { identifier: string; otp: string }) {
    const { identifier, otp } = body;
    return this.authUserService.verifyOtp(identifier, otp);
  }
}
