import { IsUUID } from 'class-validator';

export class AddToWishlistDto {
  @IsUUID('4', { message: 'productId must be a valid UUID' })
  productId!: string;
}