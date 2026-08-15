import { IsString, IsNotEmpty, IsOptional, IsUUID, IsObject, IsIn } from 'class-validator';

export class CreateStoreDto {
  @IsString()
  @IsNotEmpty({ message: 'Store name is required' })
  name!: string;

  @IsOptional()
  @IsString()
  slug?: string;

  @IsOptional()
  @IsString()
  subDomain?: string;

  @IsOptional()
  @IsIn(['default', 'electronics', 'sports', 'clothing'])
  theme?: 'default' | 'electronics' | 'sports' | 'clothing';

  @IsOptional()
  @IsIn(['dark', 'light'])
  mode?: 'dark' | 'light';

  @IsOptional()
  @IsUUID('4', { message: 'templateId must be a valid UUID' })
  templateId?: string;

  @IsOptional()
  @IsString()
  logoUrl?: string;

  @IsOptional()
  @IsObject()
  templateConfig?: Record<string, any>;
}