import { Injectable } from '@nestjs/common';
import { FROM } from 'src/shared/mailing/constants';
import { MailingService } from 'src/shared/mailing/mailing.service';
import { Email } from '../../Email';

interface VerifiedSubstitution {
  userName: string;
}

@Injectable()
export class VerifiedEmailService extends Email {
  // Edit this templateId with your own templateId
  public templateId = 'd-83f948b1b7b74ec082eaf3aac7aa4a3c';
  public from = FROM;

  constructor(private readonly mailingService: MailingService) {
    super();
  }

  async sendEmail(
    to: string | { email: string }[],
    data: VerifiedSubstitution,
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

  getSubstitution(data: VerifiedSubstitution): { [key: string]: string } {
    return {
      userName: data.userName,
    };
  }
}
