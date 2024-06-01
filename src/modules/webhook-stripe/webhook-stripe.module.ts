import { Module } from '@nestjs/common';
import { WebhookStripeController } from './webhook-stripe.controller';
import { WebhookStripeService } from './webhook-stripe.service';
import { HttpModule } from '@nestjs/axios';
import { PrismaModule } from 'src/prisma/prisma.module';
import { SharedModule } from 'src/shared/shared.module';

@Module({
  controllers: [WebhookStripeController],
  providers: [WebhookStripeService],
  imports: [HttpModule, PrismaModule, SharedModule],
})
export class WebhookStripeModule {}
