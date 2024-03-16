import { HttpException, HttpStatus } from '@nestjs/common';

export class EmailTakenException extends HttpException {
  constructor() {
    super(
      {
        statusCode: HttpStatus.FORBIDDEN,
        error: 'Email had been taken',
      },
      HttpStatus.FORBIDDEN,
    );
  }
}
