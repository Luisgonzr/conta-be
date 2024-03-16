import { From } from '../from.interface';

export abstract class Email {
  public abstract templateId: string;
  public abstract from: From;
  public abstract sendEmail(to: string | { email: string }[], data: any): void;
  public abstract getSubstitution(data: any): { [key: string]: string };
}
