import { Module } from '@nestjs/common';
import { CheckoutStripeController } from './checkout-stripe.controller';
import { CheckoutStripeService } from './checkout-stripe.service';
import { HttpModule } from '@nestjs/axios';
import { PrismaModule } from 'src/prisma/prisma.module';

@Module({
  controllers: [CheckoutStripeController],
  providers: [CheckoutStripeService],
  imports: [HttpModule, PrismaModule],
})
export class CheckoutStripeModule {}
