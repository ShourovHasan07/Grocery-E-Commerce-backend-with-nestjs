import { IsEmail, IsNotEmpty, IsOptional, MinLength } from 'class-validator';

export class CreateAdminDto {
  @IsNotEmpty({ message: 'Name is required' })
  name: string;

  @IsEmail({}, { message: 'Invalid email format' })
  email: string;

  @MinLength(6, { message: 'Password must be at least 6 characters long' })
  password: string;

  @IsOptional()
  role?: string;

  @IsOptional()
  status?: string;
}

export class UpdateAdminDto {
  @IsOptional()
  @IsNotEmpty({ message: 'Name cannot be empty' })
  name?: string;

  @IsOptional()
  @IsEmail({}, { message: 'Invalid email format' })
  email?: string;

  @IsOptional()
  @MinLength(6, { message: 'Password must be at least 6 characters long' })
  password?: string;

  @IsOptional()
  role?: string;

  @IsOptional()
  status?: string;
}
