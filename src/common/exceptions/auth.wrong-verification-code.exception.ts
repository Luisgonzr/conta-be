import { HttpException, HttpStatus } from '@nestjs/common';

export class AuthWrongVerificatioNCodeException extends HttpException {
  constructor() {
    super(
      {
        statusCode: HttpStatus.NOT_ACCEPTABLE,
        error: 'Wrong verification code',
      },
      HttpStatus.NOT_ACCEPTABLE,
    );
  }
}
