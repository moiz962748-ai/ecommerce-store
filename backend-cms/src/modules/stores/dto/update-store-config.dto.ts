import { IsOptional, IsString, IsObject } from 'class-validator';
import type { StoreTemplateConfig } from '../../../db/schema';

export class UpdateStoreConfigDto {
  @IsOptional()
  @IsString()
  name?: string;

  @IsOptional()
  @IsString()
  logoUrl?: string;

  @IsOptional()
  @IsObject()
  templateConfig?: Record<string, any>;
}