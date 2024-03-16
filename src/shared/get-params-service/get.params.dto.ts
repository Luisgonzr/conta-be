import { IsOptional } from 'class-validator';
import { orderType } from './get-params.service';

export class GetParamsDto {
  @IsOptional()
  page: number;
  @IsOptional()
  perpage: number;
  @IsOptional()
  orderBy: string;
  @IsOptional()
  orderType: orderType;
  @IsOptional()
  search: string;
}
