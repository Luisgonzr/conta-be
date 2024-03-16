import { Injectable } from '@nestjs/common';
import { FROM } from 'src/shared/mailing/constants';
import { MailingService } from 'src/shared/mailing/mailing.service';
import { Email } from '../../Email';

interface ResetPasswordSubstitution {
  userName: string;
}

@Injectable()
export class ResetPasswordEmailService extends Email {
  // Edit this templateId with your own templateId
  public templateId = 'd-2c54141bf10b495092c79173f2dc02d0';
  public from = FROM;

  constructor(private readonly mailingService: MailingService) {
    super();
  }

  async sendEmail(
    to: string | { email: string }[],
    data: ResetPasswordSubstitution,
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

  getSubstitution(data: ResetPasswordSubstitution): { [key: string]: string } {
    return {
      userName: data.userName,
    };
  }
}
