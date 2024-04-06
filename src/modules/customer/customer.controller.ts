import {
  Body,
  Controller,
  Delete,
  Get,
  Put,
  Post,
  Param,
  Query,
  UseGuards,
} from '@nestjs/common';
import { CustomerService } from './customer.service';
import { User } from 'src/common/decorators/user.decorator';
import { UserInfo } from 'src/common/interfaces/user.info';
import { GetParamsDto } from 'src/shared/get-params-service/get.params.dto';
import { CustomerCreateDto, CustomerUpdateDto } from './dtos/customer.dto';
import { JwtAuthGuard } from 'src/common/guards/jwt-auth.guard';

@UseGuards(JwtAuthGuard)
@Controller('customer')
export class CustomerController {
  constructor(private readonly customerService: CustomerService) {}

  @Get('/:id')
  async getCustomer(@Param('id') id: string, @User() user: UserInfo) {
    return await this.customerService.getCustomer(id, user.currentCompany);
  }

  @Get('/')
  async getCustomers(@Query() query: GetParamsDto, @User() user: UserInfo) {
    return await this.customerService.getCustomers(query, user.currentCompany);
  }

  @Post('/')
  async createCustomer(
    @User() user: UserInfo,
    @Body() body: CustomerCreateDto,
  ) {
    return await this.customerService.createCustomer(body, user.currentCompany);
  }

  @Put('/:id')
  async updateCustomer(
    @Param('id') id: string,
    @User() user: UserInfo,
    @Body() body: CustomerUpdateDto,
  ) {
    return await this.customerService.updateCustomer(
      id,
      body,
      user.currentCompany,
    );
  }

  @Delete('/:id')
  async deleteCustomer(@Param('id') id: string, @User() user: UserInfo) {
    return await this.customerService.deleteCustomerHard(
      id,
      user.currentCompany,
    );
  }

  @Get('/cursor/infinitescroll')
  async getCustomersWithCursor(
    @Query() query: GetParamsDto,
    @User() user: UserInfo,
  ) {
    return await this.customerService.getCustomersWithCursor(
      query,
      user.currentCompany,
    );
  }
}
