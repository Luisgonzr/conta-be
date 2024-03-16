import { Module } from '@nestjs/common';
import { MailingService } from './mailing/mailing.service';
import { HttpModule } from '@nestjs/axios';
import { ConfigModule } from '@nestjs/config';
import { SigninEmailService } from './mailing/emails/signin-email/signin-email.service';
import { UtilsService } from './utils/utils.service';
import { ResetPasswordEmailService } from './mailing/emails/reset-password-email/reset-password-email/reset-password-email.service';
import { ForgotPasswordEmailService } from './mailing/emails/forgot-password-email/forgot-password-email/forgot-password-email.service';
import { VerifiedEmailService } from './mailing/emails/verified-email/verified-email/verified-email.service';

@Module({
  imports: [HttpModule, ConfigModule.forRoot()],
  exports: [
    UtilsService,
    SigninEmailService,
    VerifiedEmailService,
    ForgotPasswordEmailService,
    ResetPasswordEmailService,
  ],
  providers: [
    MailingService,
    SigninEmailService,
    VerifiedEmailService,
    ForgotPasswordEmailService,
    ResetPasswordEmailService,
    UtilsService,
  ],
})
export class SharedModule {}
