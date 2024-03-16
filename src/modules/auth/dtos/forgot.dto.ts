import { IsEmail, MaxLength, MinLength } from 'class-validator';

export class ForgotDto {
  @IsEmail()
  @MaxLength(100)
  @MinLength(3)
  email: string;
}
