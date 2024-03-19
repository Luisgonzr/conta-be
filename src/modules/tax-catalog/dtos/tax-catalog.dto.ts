import {
  MaxLength,
  MinLength,
  IsNumber,
  IsBoolean,
  IsOptional,
} from 'class-validator';

export class TaxCatalogCreateDto {
  @MaxLength(100)
  @MinLength(3)
  name: string;
  @MaxLength(100)
  @MinLength(3)
  description: string;
  @MaxLength(100)
  @MinLength(3)
  taxType: string;
  @MaxLength(100)
  @MinLength(3)
  taxFactor: string;
  @IsNumber()
  taxRate: number;
  @IsOptional()
  @IsNumber()
  base: number;
  @IsBoolean()
  taxAWithheldByCustomer: boolean;
}
