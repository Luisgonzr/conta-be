import { Injectable } from '@nestjs/common';
import { Email } from '../Email';
import { FROM } from '../../constants';
import { MailingService } from '../../mailing.service';

interface WelcomeSubstitution {
  url: string;
}

@Injectable()
export class WelcomeEmailService extends Email {
  // Edit this templateId with your own templateId
  public templateId = 'd-29811af389694f07908e98eea9f6d2e2';
  public from = FROM;

  constructor(private readonly mailingService: MailingService) {
    super();
  }

  async sendEmail(to: string | { email: string }[], data: WelcomeSubstitution) {
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

  getSubstitution(data: WelcomeSubstitution): { [key: string]: string } {
    return {
      url: data.url,
    };
  }
}
