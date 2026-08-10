import { IsString, IsNotEmpty, IsOptional, IsUUID, IsNumber, Min } from 'class-validator';

export class CreateOrderDto {
  @IsUUID('4', { message: 'storeId ek valid UUID hona chahiye' })
  storeId!: string;

  @IsNumber({}, { message: 'price ek number hona chahiye' })
  @Min(0, { message: 'price negative nahi ho sakta' })
  price!: number;

  @IsString()
  @IsNotEmpty({ message: 'Delivery address zaroori hai' })
  address!: string;

  @IsOptional()
  @IsUUID('4', { message: 'userId ek valid UUID hona chahiye' })
  userId?: string;
}