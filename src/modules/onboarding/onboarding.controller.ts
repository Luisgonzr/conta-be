import { Body, Controller, HttpCode, Param, Post } from '@nestjs/common';
import { Public } from 'src/common/decorators/public.decorator';
import { OnboardingService } from './onboarding.service';
import {
  GetTokenDto,
  SetCompanyDto,
  SetPasswordDto,
  SetTaxProfileDto,
} from './dtos';

@Controller('onboarding')
export class OnboardingController {
  constructor(private readonly OnboardingService: OnboardingService) {}
  @Public()
  @Post('get-token')
  @HttpCode(200)
  async getToken(@Body() getTokenDto: GetTokenDto) {
    return await this.OnboardingService.getToken(
      getTokenDto.verificationCode,
      getTokenDto.email,
    );
  }

  @Public()
  @Post('set-password/:code')
  @HttpCode(200)
  async setPassword(
    @Body() setPasswordDto: SetPasswordDto,
    @Param('code') code: string,
  ) {
    return { code, ...setPasswordDto };
  }

  @Public()
  @Post('set-company/:code')
  @HttpCode(200)
  async setCompany(
    @Body() setCompanyDto: SetCompanyDto,
    @Param('code') code: string,
  ) {
    return { code, ...setCompanyDto };
  }

  @Public()
  @Post('set-tax-profile/:code')
  @HttpCode(200)
  async setTaxProfile(
    @Body() setTaxProfileDto: SetTaxProfileDto,
    @Param('code') code: string,
  ) {
    return { code, ...setTaxProfileDto };
  }
}
