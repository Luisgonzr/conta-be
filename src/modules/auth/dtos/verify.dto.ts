import { IsEmail, IsString, MaxLength, MinLength } from 'class-validator';

export class VerifyDto {
  @IsEmail()
  @MaxLength(100)
  @MinLength(3)
  email: string;
  @IsString()
  @MaxLength(100)
  @MinLength(8)
  verificationToken: string;
}
