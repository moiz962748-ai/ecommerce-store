import { IsString, IsNotEmpty, IsOptional, IsUUID, IsNumber, Min } from 'class-validator';

export class CreateOrderDto {
  @IsUUID('4', { message: 'storeId must be a valid UUID' })
  storeId!: string;

  @IsNumber({}, { message: 'price must be a number' })
  @Min(0, { message: 'price cannot be negative' })
  price!: number;

  @IsString()
  @IsNotEmpty({ message: 'Delivery address is required' })
  address!: string;

  @IsOptional()
  @IsUUID('4', { message: 'userId must be a valid UUID' })
  userId?: string;
}