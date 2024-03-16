import { Exclude } from 'class-transformer';

export class SigninResponseDto {
  name: string;
  email: string;
  @Exclude()
  password: string;
  @Exclude()
  role: string;
  @Exclude()
  createdAt: Date;
  @Exclude()
  updatedAt: Date;
  constructor(partial: Partial<SigninResponseDto>) {
    Object.assign(this, partial);
  }
}

export class LoginResponseDto {
  name: string;
  email: string;
  @Exclude()
  password: string;
  role: string;
  @Exclude()
  createdAt: Date;
  @Exclude()
  updatedAt: Date;
  constructor(partial: Partial<SigninResponseDto>) {
    Object.assign(this, partial);
  }
}
