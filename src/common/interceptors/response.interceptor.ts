import {
  Injectable,
  NestInterceptor,
  ExecutionContext,
  CallHandler,
} from '@nestjs/common';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import * as jwt from 'jsonwebtoken';
import { Reflector } from '@nestjs/core';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class ResponseInterceptor implements NestInterceptor {
  constructor(
    private readonly reflector: Reflector,
    private readonly config: ConfigService,
  ) {}
  async intercept(
    context: ExecutionContext,
    next: CallHandler,
  ): Promise<Observable<any>> {

    const isPublic = this.reflector.get<boolean>(
      'isPublic',
      context.getHandler(),
    );
    if (isPublic) {
      return next.handle();
    }

    return next.handle().pipe(
      map(async (data) => {
        const request = context.switchToHttp().getRequest();
        const token = await jwt.sign(
          request.user,
          this.config.get('JWT_SECRET'),
          {
            expiresIn: this.config.get('JWT_EXPIRES_IN'),
          },
        );
        return { data, token };
      }),
    );
  }
}
