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
import { ProductAndServiceCategoryModule } from './modules/product-and-service-category/product-and-service-category.module';
import { WebhookStripeModule } from './modules/webhook-stripe/webhook-stripe.module';
import { SharedModule } from './shared/shared.module';
import { PlanModule } from './modules/plan/plan.module';
import { CheckoutStripeModule } from './modules/checkout-stripe/checkout-stripe.module';
import { OnboardingModule } from './modules/onboarding/onboarding.module';

@Module({
  imports: [
    PrismaModule,
    SharedModule,
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
    PlanModule,
    CheckoutStripeModule,
    OnboardingModule,
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
  ],
})
export class AppModule {}
