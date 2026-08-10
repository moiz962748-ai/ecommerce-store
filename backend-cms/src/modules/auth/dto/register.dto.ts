import { IsEmail, IsNotEmpty, IsString, MinLength } from 'class-validator';

export class RegisterDto {
  @IsEmail({}, { message: 'Sahi email format dein' })
  email!: string;

  @IsString()
  @MinLength(6, { message: 'Password kam se kam 6 characters ka hona chahiye' })
  password!: string;

  @IsString()
  @IsNotEmpty({ message: 'Full name zaroori hai' })
  fullName!: string;
}