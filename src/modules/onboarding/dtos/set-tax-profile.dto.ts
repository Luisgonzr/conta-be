import { IsString, Matches, MaxLength, MinLength } from 'class-validator';

export class SetTaxProfileDto {
  @MaxLength(13)
  @MinLength(12)
  taxId: string;
  @IsString()
  @MaxLength(100)
  @MinLength(3)
  taxName: string;
  @MaxLength(5)
  @MinLength(5)
  @Matches(/^[0-9]{5}$/)
  taxZipCode: string;
  @IsString()
  taxSystemProxy: string;
}
