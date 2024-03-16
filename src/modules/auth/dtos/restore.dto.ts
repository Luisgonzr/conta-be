import { IsEmail, IsString, MaxLength, MinLength } from 'class-validator';

export class RestoreDto {
  @MaxLength(64)
  @MinLength(64)
  passwordResetToken: string;
  @IsEmail()
  @MaxLength(100)
  @MinLength(3)
  email: string;
  @IsString()
  @MaxLength(100)
  @MinLength(8)
  password: string;
}
