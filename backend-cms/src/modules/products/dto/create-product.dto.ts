import {
  IsString,
  IsNotEmpty,
  IsOptional,
  IsUUID,
  IsNumber,
  Min,
  IsArray,
  ValidateNested,
} from 'class-validator';
import { Type } from 'class-transformer';

export class CreateVariantDto {
  @IsString()
  @IsNotEmpty({ message: 'Variant name is required' })
  name!: string; // e.g. "Crimson Red / Large" ya "Midnight Black 256GB"

  @IsOptional()
  @IsString()
  description?: string;

  @IsOptional()
  @IsString()
  imageUrl?: string;

  @IsNumber({}, { message: 'Variant price must be a number' })
  @Min(0, { message: 'Variant price cannot be negative' })
  @Type(() => Number)
  price!: number;

  @IsOptional()
  @IsString()
  sku?: string;

  @IsOptional()
  @IsNumber({}, { message: 'Variant stock must be a number' })
  @Min(0, { message: 'Variant stock cannot be negative' })
  @Type(() => Number)
  stock?: number;
}

export class CreateProductDto {
  @IsString()
  @IsNotEmpty({ message: 'Product name is required' })
  name!: string;

  @IsOptional()
  @IsString()
  description?: string;

  @IsOptional()
  @IsString()
  imageUrl?: string;

  @IsNumber({}, { message: 'basePrice must be a number' })
  @Min(0, { message: 'basePrice cannot be negative' })
  @Type(() => Number)
  basePrice!: number;

  @IsUUID('4', { message: 'storeId must be a valid UUID' })
  storeId!: string;

  @IsUUID('4', { message: 'categoryId must be a valid UUID' })
  categoryId!: string;

  @IsOptional()
  @IsArray({ message: 'variants must be an array' })
  @ValidateNested({ each: true })
  @Type(() => CreateVariantDto)
  variants?: CreateVariantDto[];
}

export class UpdateProductDto {
  @IsOptional()
  @IsString()
  @IsNotEmpty({ message: 'Product name is required' })
  name?: string;

  @IsOptional()
  @IsString()
  description?: string;

  @IsOptional()
  @IsString()
  imageUrl?: string;

  @IsOptional()
  @IsNumber({}, { message: 'basePrice must be a number' })
  @Min(0, { message: 'basePrice cannot be negative' })
  @Type(() => Number)
  basePrice?: number;

  @IsOptional()
  @IsUUID('4', { message: 'storeId must be a valid UUID' })
  storeId?: string;

  @IsOptional()
  @IsUUID('4', { message: 'categoryId must be a valid UUID' })
  categoryId?: string;

  @IsOptional()
  @IsArray({ message: 'variants must be an array' })
  @ValidateNested({ each: true })
  @Type(() => CreateVariantDto)
  variants?: CreateVariantDto[];
}