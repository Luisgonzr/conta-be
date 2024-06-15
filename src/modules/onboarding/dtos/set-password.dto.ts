import { IsString, MaxLength, MinLength } from 'class-validator';

export class SetPasswordDto {
  @MaxLength(40)
  @MinLength(6)
  name: string;
  @IsString()
  @MaxLength(20)
  @MinLength(6)
  password: string;
  @IsString()
  @MaxLength(20)
  @MinLength(6)
  //@Equals('password')
  confirmPassword: string;
}
