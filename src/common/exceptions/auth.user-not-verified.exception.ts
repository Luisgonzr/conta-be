import { HttpException, HttpStatus } from '@nestjs/common';

export class AuthUserNotVerifiedException extends HttpException {
  constructor() {
    super(
      {
        statusCode: HttpStatus.NOT_FOUND,
        error: 'User not verified',
      },
      HttpStatus.NOT_FOUND,
    );
  }
}
