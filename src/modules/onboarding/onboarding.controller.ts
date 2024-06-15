import { Body, Controller, HttpCode, Post, UseGuards } from '@nestjs/common';
import { Public } from 'src/common/decorators/public.decorator';
import { OnboardingService } from './onboarding.service';
import {
  GetTokenDto,
  SetCompanyDto,
  SetPasswordDto,
  SetTaxProfileDto,
} from './dtos';
import { User } from 'src/common/decorators/user.decorator';
import { UserInfo } from 'src/common/interfaces/user.info';
import { OnboardingGuard } from 'src/common/guards/onboarding.guard';

@UseGuards(OnboardingGuard)
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

  @Post('set-password')
  @HttpCode(200)
  async setPassword(
    @Body() setPasswordDto: SetPasswordDto,
    @User() user: UserInfo,
  ) {
    console.log(setPasswordDto, user.id);
    return await this.OnboardingService.setPassword(setPasswordDto, user.id);
  }

  @Public()
  @Post('set-company')
  @HttpCode(200)
  async setCompany(
    @Body() setCompanyDto: SetCompanyDto,
    @User() user: UserInfo,
  ) {
    return await this.OnboardingService.setCompany(
      setCompanyDto,
      user.currentCompany,
    );
  }

  @Public()
  @Post('set-tax-profile')
  @HttpCode(200)
  async setTaxProfile(
    @Body() setTaxProfileDto: SetTaxProfileDto,
    @User() user: UserInfo,
  ) {
    return await this.OnboardingService.setTaxProfile(
      setTaxProfileDto,
      user.currentCompany,
    );
  }
}
