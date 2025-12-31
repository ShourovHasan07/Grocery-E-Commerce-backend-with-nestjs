// src/products/dto/create-product.dto.ts
import { IsString, IsNotEmpty, IsNumber, IsOptional, IsArray, IsDate } from 'class-validator';
import { Transform, Type } from 'class-transformer';

export class CreateProductDto {
  @IsNotEmpty() @IsString() name: string;
  @IsNotEmpty() @IsString() category: string;
  @IsNotEmpty() @IsString() vendor: string;

  @IsNotEmpty() @Type(() => Number) @IsNumber() price: number;
  @IsOptional() @Type(() => Number) @IsNumber() oldPrice?: number;
  @IsOptional() @Type(() => Number) @IsNumber() discount?: number;

  @IsOptional() @IsString() badge?: 'hot' | 'sale' | 'new' | 'best';
  @IsOptional() @Type(() => Number) @IsNumber() rating?: number;
  @IsOptional() @Type(() => Number) @IsNumber() reviewCount?: number;

 @IsOptional()
@IsString()
image?: string; // Cloudinary URL
  @IsOptional() @IsArray() @IsString({ each: true }) images?: string[];
  @IsOptional() @IsString() hoverImage?: string;

  @IsNotEmpty() @IsString() shortDescription: string;
  @IsNotEmpty() @IsString() description: string;
  @IsOptional() @IsString() additionalInfo?: string;
 

  @IsNotEmpty() @Type(() => Number) @IsNumber() stock: number;
  @IsOptional() @IsString() type?: string;
  @IsOptional() @Type(() => Date) @IsDate() manufactureDate?: Date;
  @IsOptional() @Type(() => Number) @IsNumber() lifeTimeDays?: number;
  @IsOptional() @IsString() sku?: string;
  

  @IsOptional() @IsString() ingredients?: string;
  @IsOptional() @IsString() warnings?: string;
  @IsOptional() @IsString() suggestedUse?: string;
  @IsOptional() @IsString() packagingInfo?: string;
  @IsOptional() @IsString() deliveryInfo?: string;

   @IsOptional()
  @IsArray()
  @IsString({ each: true })
  @Transform(({ value }) => typeof value === 'string' ? value.split(',') : value)
  sizes?: string[];

   @IsOptional()
  @IsArray()
  @IsString({ each: true })
  @Transform(({ value }) => typeof value === 'string' ? value.split(',') : value)
  tags?: string[];


}
