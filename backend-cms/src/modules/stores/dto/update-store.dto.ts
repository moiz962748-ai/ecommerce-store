import { IsString, IsOptional, IsObject, IsIn } from 'class-validator';

export class UpdateStoreDto {
  @IsOptional()
  @IsString()
  name?: string;

  @IsOptional()
  @IsString()
  logoUrl?: string;

  @IsOptional()
  @IsIn(['default', 'electronics', 'sports', 'clothing'])
  theme?: 'default' | 'electronics' | 'sports' | 'clothing';

  @IsOptional()
  @IsIn(['dark', 'light'])
  mode?: 'dark' | 'light';

  @IsOptional()
  @IsObject()
  templateConfig?: Record<string, any>;
}