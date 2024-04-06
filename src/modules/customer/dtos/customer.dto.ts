import { Type } from 'class-transformer';
import {
  IsEmail,
  IsOptional,
  Matches,
  MaxLength,
  MinLength,
  ValidateNested,
} from 'class-validator';


export class TaxProfileDto {
  @IsOptional()
  @MaxLength(13)
  @MinLength(12)
  taxId: string;
  @IsOptional()
  @MaxLength(100)
  @MinLength(3)
  taxName: string;
  @IsOptional()
  @MinLength(5)
  @MaxLength(5)
  @Matches(/^[0-9]*$/)
  taxZipCode: string;
  @IsOptional()
  taxSystem: string;
}

export class CustomerCreateDto {
  @MaxLength(100)
  @MinLength(3)
  name: string;
  @IsEmail()
  email: string;
  @MinLength(10)
  @MaxLength(10)
  @Matches(/^[0-9]*$/)
  phone: string;
  @MinLength(3)
  @MaxLength(100)
  companyName: string;
  @ValidateNested()
  @Type(() => TaxProfileDto)
  taxProfile: TaxProfileDto;
}

export class CustomerUpdateDto {
  @IsOptional()
  @MaxLength(100)
  @MinLength(3)
  name: string;
  @IsOptional()
  @IsEmail()
  email: string;
  @IsOptional()
  @MinLength(10)
  @MaxLength(10)
  @Matches(/^[0-9]*$/)
  phone: string;
  @IsOptional()
  @MinLength(3)
  @MaxLength(100)
  companyName: string;
  @ValidateNested()
  @Type(() => TaxProfileDto)
  taxProfile: TaxProfileDto;
}
