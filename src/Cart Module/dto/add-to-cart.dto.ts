import { IsInt, IsOptional, IsString, Min } from 'class-validator';

export class AddToCartDto {
  @IsInt()
  productId: number;

  @IsInt()
  @Min(1)
  quantity: number;

   @IsOptional()
  @IsString()
  guestId?: string;

}
