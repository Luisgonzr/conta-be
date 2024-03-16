import { Injectable } from '@nestjs/common';
import { FROM } from '../../constants';
import { MailingService } from '../../mailing.service';
import { Email } from '../Email';

interface SigninSubstitution {
  name: string;
  actionUrl: string;
  verificationToken: string;
}

@Injectable()
export class SigninEmailService extends Email {
  // Edit this templateId with your own templateId
  public templateId = 'd-e2676492a86b43cb980da310b67d196f';
  public from = FROM;

  constructor(private readonly mailingService: MailingService) {
    super();
  }

  async sendEmail(to: string | { email: string }[], data: SigninSubstitution) {
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

  getSubstitution(data: SigninSubstitution): { [key: string]: string } {
    return {
      userName: data.name,
      actionUrl: data.actionUrl,
      verificationToken: data.verificationToken,
    };
  }
}
