import { Body, Controller, HttpCode, Post } from '@nestjs/common';
import { Public } from 'src/common/decorators/public.decorator';
import { AuthService } from './auth.service';
import { ForgotDto, LoginDto, RestoreDto, SigninDto, VerifyDto } from './dtos';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Public()
  @Post('login')
  @HttpCode(200)
  async login(@Body() loginDto: LoginDto) {
    return await this.authService.login(loginDto);
  }

  @Public()
  @Post('signin')
  @HttpCode(200)
  async signin(@Body() signinDto: SigninDto) {
    return await this.authService.signin(signinDto);
  }

  @Public()
  @Post('verify')
  @HttpCode(200)
  async verify(@Body() verifyDto: VerifyDto) {
    return await this.authService.verify(verifyDto);
  }

  @Public()
  @Post('forgot-password')
  @HttpCode(200)
  async forgotPassword(@Body() forgotDto: ForgotDto) {
    return this.authService.forgotPassword(forgotDto);
  }

  @Public()
  @Post('reset-password')
  @HttpCode(200)
  async resetPassword(@Body() restoreDto: RestoreDto) {
    return this.authService.resetPassword(restoreDto);
  }

  @Public()
  @Post('refresh-token')
  @HttpCode(200)
  async refreshToken(@Body() refreshTokenDto: { refreshToken: string }) {
    return await this.authService.refreshToken(refreshTokenDto);
  }
}
