import { IsEmail, MaxLength, MinLength } from 'class-validator';

export class GetTokenDto {
  @IsEmail()
  email: string;
  @MaxLength(200)
  @MinLength(6)
  verificationCode: string;
}
