import { IsString, IsNotEmpty, IsOptional, IsUUID, IsObject } from 'class-validator';

export class CreateStoreDto {
  @IsString()
  @IsNotEmpty({ message: 'Store name zaroori hai' })
  name!: string;

  @IsOptional()
  @IsString()
  slug?: string;

  @IsOptional()
  @IsString()
  subDomain?: string;

  @IsOptional()
  @IsUUID('4', { message: 'templateId ek valid UUID hona chahiye' })
  templateId?: string;

  @IsOptional()
  @IsString()
  logoUrl?: string;

  @IsOptional()
  @IsObject()
  templateConfig?: Record<string, any>;
}