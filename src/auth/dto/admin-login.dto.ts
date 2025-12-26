// src/modules/auth/dto/admin-login.dto.ts
import { IsEmail, IsNotEmpty } from 'class-validator';

export class AdminLoginDto {
  @IsEmail({}, { message: 'Valid email required' })
  email: string;

  @IsNotEmpty({ message: 'Password is required' })
  password: string;
}
