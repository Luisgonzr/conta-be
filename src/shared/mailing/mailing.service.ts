import { HttpService } from '@nestjs/axios/dist';
import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { From } from './from.interface';

@Injectable()
export class MailingService {
  constructor(
    private readonly config: ConfigService,
    private readonly httpService: HttpService,
  ) {}

  /**
   * Send an email using SendGrid
   * @param from 
   * @param toEmail 
   * @param template 
   * @param substitutions 
   * @param replyTo 
   * @param attachment 
   * @returns 
   */
  sendTemplateEmail(
    from: From,
    toEmail: string | { email: string }[],
    template: string,
    substitutions: any,
    replyTo?: string,
    attachment?: any,
  ) {
    return new Promise((resolve, reject) => {
      let to = [];
      if (Array.isArray(toEmail)) {
        to = toEmail;
      } else {
        to = [{ email: toEmail }];
      }
      const email = {
        from: {
          email: from.email,
          name: from.email,
        },
        template_id: template,
        personalizations: [
          {
            to: to,
            dynamic_template_data: substitutions,
          },
        ],
      };
      if (attachment) {
        email['attachments'] = attachment;
      }
      if (replyTo) {
        email['reply_to'] = {
          email: replyTo,
          name: 'Reply',
        };
      }
      this.httpService
        .post(this.config.get('SENDGRID_API_URL'), email, {
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${this.config.get('SENDGRID_API_KEY')}`,
          },
        })
        .subscribe({
          next: (response) => {
            resolve(response);
          },
          error: (error) => {
            console.log(error);
            reject(error);
          },
        });
    });
  }
}
