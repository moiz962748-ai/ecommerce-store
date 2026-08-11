import { IsString, IsNotEmpty, IsOptional, IsUUID, IsNumber, Min } from 'class-validator';

export class CreateProductDto {
  @IsString()
  @IsNotEmpty({ message: 'Product name is required' })
  name!: string;

  @IsOptional()
  @IsString()
  description?: string;

  @IsNumber({}, { message: 'basePrice must be a number' })
  @Min(0, { message: 'basePrice cannot be negative' })
  basePrice!: number;

  @IsUUID('4', { message: 'storeId must be a valid UUID' })
  storeId!: string;

  @IsUUID('4', { message: 'categoryId must be a valid UUID' })
  categoryId!: string;
}