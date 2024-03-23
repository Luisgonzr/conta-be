import { CorsOptions } from '@nestjs/common/interfaces/external/cors-options.interface';

export const CORS: CorsOptions = {
  origin: ['http://localhost:4200', process.env.FRONTEND_URL],
}