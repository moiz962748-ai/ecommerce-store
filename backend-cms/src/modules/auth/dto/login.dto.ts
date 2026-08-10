import { IsEmail, IsNotEmpty, IsString } from 'class-validator';

export class LoginDto {
  @IsEmail({}, { message: 'Sahi email format dein' })
  email!: string;

  @IsString()
  @IsNotEmpty({ message: 'Password zaroori hai' })
  password!: string;
}