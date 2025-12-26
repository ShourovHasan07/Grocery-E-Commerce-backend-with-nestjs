import { IsEmail, IsOptional, IsString, IsBoolean } from 'class-validator';

export class CreateUserDto {
  @IsOptional()
  @IsString()
  clerkId?: string;

  @IsOptional()
  @IsString()
  name?: string;

  @IsEmail()
  email: string;

  @IsOptional()
  @IsString()
  password?: string;

  @IsOptional()
  @IsBoolean()
  status?: boolean;
}
