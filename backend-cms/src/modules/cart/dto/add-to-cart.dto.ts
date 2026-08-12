import { IsUUID, IsInt, Min } from 'class-validator';

export class AddToCartDto {
  @IsUUID('4', { message: 'productId must be a valid UUID' })
  productId!: string;

  @IsInt()
  @Min(1, { message: 'quantity must be at least 1' })
  quantity!: number;
}