import { Injectable } from '@nestjs/common';
import { FROM } from 'src/shared/mailing/constants';
import { MailingService } from 'src/shared/mailing/mailing.service';
import { Email } from '../../Email';

interface ForgotPasswordSubstitution {
  userName: string;
  passwordResetToken: string;
  passwordResetExpires: string;
  actionUrl: string;
}

@Injectable()
export class ForgotPasswordEmailService extends Email {
  // Edit this templateId with your own templateId
  public templateId = 'd-608b9050bc89450a829060f1bccd3e19';
  public from = FROM;

  constructor(private readonly mailingService: MailingService) {
    super();
  }

  async sendEmail(
    to: string | { email: string }[],
    data: ForgotPasswordSubstitution,
  ) {
    try {
      return await this.mailingService.sendTemplateEmail(
        this.from,
        to,
        this.templateId,
        this.getSubstitution(data),
      );
    } catch (error) {
      console.log(error.response.body);
    }
  }

  getSubstitution(data: ForgotPasswordSubstitution): { [key: string]: string } {
    return {
      userName: data.userName,
      passwordResetToken: data.passwordResetToken,
      passwordResetExpires: data.passwordResetExpires,
      actionUrl: data.actionUrl,
    };
  }
}
