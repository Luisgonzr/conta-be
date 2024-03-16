import { HttpException, HttpStatus } from '@nestjs/common';

export class AuthUserNotFoundException extends HttpException {
  constructor() {
    super(
      {
        statusCode: HttpStatus.NOT_FOUND,
        error: 'Email or password is incorrect',
      },
      HttpStatus.NOT_FOUND,
    );
  }
}
