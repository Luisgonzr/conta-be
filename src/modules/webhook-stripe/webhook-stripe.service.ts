import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PrismaService } from 'src/prisma/prisma.service';
import {
  MomentMeasurements,
  UtilsService,
} from 'src/shared/utils/utils.service';
import Stripe from 'stripe';

@Injectable()
export class WebhookStripeService {
  constructor(
    private readonly configService: ConfigService,
    private readonly prismaService: PrismaService,
    private readonly utilsService: UtilsService,
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
      case 'customer.created':
        const JsonCustomerString = JSON.stringify(event.data.object);
        const JsonCustomer = JSON.parse(JsonCustomerString);
        const marketingEmail = await this.prismaService.marketingEmail
          .create({
            data: {
              email: JsonCustomer['email'],
              stripeId: JsonCustomer['id'],
            },
          })
          .catch((error) => {
            console.log(error);
            throw new Error('Error creating email');
          });
        break;
      case 'payment_intent.succeeded':
        console.log(event.data.object);
        const paymentIntent = event.data.object;
        await this.prismaService.webhookDummy.create({
          data: {
            type: event.type,
            event: JSON.stringify(paymentIntent),
          },
        });
        break;
      case 'payment_method.attached':
        console.log(event.data.object);
        const paymentMethod = event.data.object;
        await this.prismaService.webhookDummy.create({
          data: {
            type: event.type,
            event: JSON.stringify(paymentMethod),
          },
        });
        break;
      case 'checkout.session.completed':
        console.log(event.data.object);
        const paymentMethodA = event.data.object;
        const JsonObjectString = JSON.stringify(event.data.object);
        const JsonObject = JSON.parse(JsonObjectString);
        const stripeSubscriptionId = JsonObject['subscription'];
        const stripeCustomerId = JsonObject['customer'];
        const customerEmail = JsonObject['customer_details']['email'];
        const stripe = new Stripe(
          this.configService.get('STRIPE_SECRET_KEY_TEST'),
        );
        const subscription = await stripe.subscriptions.retrieve(
          stripeSubscriptionId,
        );
        const plan = subscription['items']['data'][0]['price']['product'];
        console.log('Plan:', plan);
        console.log('Subscription:', subscription);
        console.log('Customer:', customerEmail);
        console.log('Customer Id:', stripeCustomerId);
        await this.prismaService.webhookDummy.create({
          data: {
            type: event.type,
            event: JSON.stringify(paymentMethodA),
          },
        });
        break;
      case 'payment_intent.created':
        console.log(event.data.object);
        const paymentMethodB = event.data.object;
        await this.prismaService.webhookDummy.create({
          data: {
            type: event.type,
            event: JSON.stringify(paymentMethodB),
          },
        });
        break;
      default:
        await this.prismaService.webhookDummy.create({
          data: {
            type: event.type,
            event: JSON.stringify(event.data.object),
          },
        });
        break;
    }
    return { received: true };
  }
}
