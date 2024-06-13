import { MaxLength, MinLength } from 'class-validator';

export class SetCompanyDto {
  @MaxLength(40)
  @MinLength(2)
  name: string;
  @MaxLength(6)
  @MinLength(200)
  activityDescription: string;
}
