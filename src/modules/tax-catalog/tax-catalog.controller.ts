import { Body, Controller, Delete, Get, Param, Post, Query, UseGuards } from '@nestjs/common';
import { TaxCatalogService } from './tax-catalog.service';
import { User } from '../../common/decorators/user.decorator';
import { TaxCatalogCreateDto } from './dtos/tax-catalog.dto';
import { UserInfo } from '../../common/interfaces/user.info';
import { JwtAuthGuard } from 'src/common/guards/jwt-auth.guard';
import { GetParamsDto } from 'src/shared/get-params-service/get.params.dto';

@UseGuards(JwtAuthGuard)
@Controller('tax-catalog')
export class TaxCatalogController {
  constructor(private readonly taxCatalogService: TaxCatalogService) {}

  @Post('/')
  async createTaxes(@User() user: UserInfo, @Body() body: TaxCatalogCreateDto) {
    return await this.taxCatalogService.createTaxes(body, user.currentCompany);
  }

  @Get('/')
  async getTaxes(@Query() query: GetParamsDto, @User() user: UserInfo) {
    return await this.taxCatalogService.getTaxes(query, user.currentCompany);
  }

  @Delete(':id')
  async deleteTaxes(@Param('id') id: string, @User() user: UserInfo) {
    return await this.taxCatalogService.deleteTaxes(id, user.currentCompany);
  }
  
}
