import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PrismaService } from 'src/prisma/prisma.service';
import Stripe from 'stripe';

@Injectable()
export class WebhookStripeService {
  constructor(
    private readonly configService: ConfigService,
    private readonly prismaService: PrismaService,
  ) {}

  

  async stripeWebhook(data: Buffer, headers: any) {
    const stripe = new Stripe(this.configService.get('STRIPE_SECRET_KEY_TEST'));
    let event;
    const endpoint = this.configService.get('STRIPE_ENDPOINT_SECRET');
    if (endpoint) {
      const signature = headers['stripe-signature'];
      console.log('Signature:', signature);
      try {
        event = stripe.webhooks.constructEvent(data, signature, endpoint);
      } catch (err) {
        console.log(`⚠️  Webhook signature verification failed.`, err.message);
        throw new Error(err);
      }
    }
    switch (event.type) {
      case 'payment_intent.succeeded':
        const paymentIntent = event.data.object;
        await this.prismaService.webhookDummy.create({
          data: {
            type: event.type,
            event: JSON.stringify(paymentIntent),
          },
        });
        break;
      case 'payment_method.attached':
        const paymentMethod = event.data.object;
        await this.prismaService.webhookDummy.create({
          data: {
            type: event.type,
            event: JSON.stringify(paymentIntent),
          },
        });
        break;
      case 'checkout.session.completed':
        const paymentMethodA = event.data.object;
        await this.prismaService.webhookDummy.create({
          data: {
            type: event.type,
            event: JSON.stringify(paymentIntent),
          },
        });
        break;
      case 'payment_intent.created':
        const paymentMethodB = event.data.object;
        await this.prismaService.webhookDummy.create({
          data: {
            type: event.type,
            event: JSON.stringify(paymentIntent),
          },
        });
        break;
      default:
        await this.prismaService.webhookDummy.create({
          data: {
            type: event.type,
            event: JSON.stringify(paymentIntent),
          },
        });
        break;
    }
    return { received: true };
  }
}
