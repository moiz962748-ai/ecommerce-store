import { IsString, IsNotEmpty, IsOptional, IsUUID, IsNumber, Min } from 'class-validator';

export class CreateProductDto {
  @IsString()
  @IsNotEmpty({ message: 'Product name zaroori hai' })
  name!: string;

  @IsOptional()
  @IsString()
  description?: string;

  @IsNumber({}, { message: 'basePrice ek number hona chahiye' })
  @Min(0, { message: 'basePrice negative nahi ho sakta' })
  basePrice!: number;

  @IsUUID('4', { message: 'storeId ek valid UUID hona chahiye' })
  storeId!: string;

  @IsUUID('4', { message: 'categoryId ek valid UUID hona chahiye' })
  categoryId!: string;
}