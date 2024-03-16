import { Injectable } from '@nestjs/common';
import * as crypto from 'crypto';
import * as moment from 'moment';

export enum MomentMeasurements {
  seconds = 's',
  minutes = 'm',
  hours = 'h',
  days = 'd',
  weeks = 'w',
  months = 'M',
  years = 'y',
  milliseconds = 'ms',
  quarters = 'Q',
}

@Injectable()
export class UtilsService {
  generateRandomString(length: number): string {
    return crypto.randomBytes(length).toString('hex');
  }

  getExpirationDate(
    unit = 1,
    measure: MomentMeasurements = MomentMeasurements.minutes,
  ): Date {
    return moment().add(unit, measure).toDate();
  }
}
