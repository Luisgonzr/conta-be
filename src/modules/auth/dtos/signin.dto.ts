import { IsEmail, IsString, MaxLength, MinLength } from 'class-validator';

export class SigninDto {
  @MaxLength(100)
  @MinLength(3)
  name: string;
  @IsEmail()
  @MaxLength(100)
  @MinLength(3)
  email: string;
  @IsString()
  @MaxLength(100)
  @MinLength(8)
  password: string;
}
