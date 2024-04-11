import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { ThrottlerGuard, ThrottlerModule } from '@nestjs/throttler';
import { APP_GUARD, APP_INTERCEPTOR } from '@nestjs/core';
import { ResponseInterceptor } from './common/interceptors/response.interceptor';
import { PrismaModule } from './prisma/prisma.module';
import { AuthModule } from './modules/auth/auth.module';
import { TaxCatalogModule } from './modules/tax-catalog/tax-catalog.module';
import { CustomerModule } from './modules/customer/customer.module';
import { SharedService } from './mexico-invoicing-rules/shared/shared.service';
import { ProductAndServiceCategoryModule } from './modules/product-and-service-category/product-and-service-category.module';
import { WebhookStripeModule } from './modules/webhook-stripe/webhook-stripe.module';

@Module({
  imports: [
    PrismaModule,
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: `.env`,
    }),
    ThrottlerModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (config: ConfigService) => [
        {
          ttl: config.get('THROTTLE_TTL'),
          limit: config.get('THROTTLE_LIMIT'),
        },
      ],
    }),
    CustomerModule,
    AuthModule,
    TaxCatalogModule,
    ProductAndServiceCategoryModule,
    WebhookStripeModule,
  ],
  controllers: [AppController],
  providers: [
    AppService,
    {
      provide: APP_GUARD,
      useClass: ThrottlerGuard,
    },
    {
      provide: APP_INTERCEPTOR,
      useClass: ResponseInterceptor,
    },
    SharedService,
  ],
})
export class AppModule {}
