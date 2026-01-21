import { IsEmail, IsOptional, IsString, IsBoolean } from 'class-validator';

export class CreateUserDto {
  @IsOptional()
  @IsString()
  clerkId?: string;

  @IsOptional()
  @IsString()
  name?: string;

  @IsOptional()
  @IsEmail()
  email?: string; // optional + email

  @IsOptional()
  @IsString()
  phone?: string | null; // optional + nullable

  @IsOptional()
  @IsString()
  password?: string;

  @IsOptional()
  @IsBoolean()
  status?: boolean;
}

