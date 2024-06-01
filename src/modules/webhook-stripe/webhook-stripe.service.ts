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
      case 'customer.subscription.created':
        const JsonDataString = JSON.stringify(event.data.object);
        const JsonData = JSON.parse(JsonDataString);
        const email = await this.prismaService.marketingEmail.findFirst({
          where: {
            stripeId: JsonData['customer'],
          },
        });
        const verificationToken = await this.utilsService.generateRandomString(
          32,
        );
        const verificationDeadline = this.utilsService.getExpirationDate(
          5,
          MomentMeasurements.days,
        );
        const currentBillingPlan =
          await this.prismaService.businessBillingPlan.findFirst({
            where: {
              stripeId: JsonData['plan']['id'],
            },
          });
        await this.prismaService.userMain.create({
          data: {
            email: email.email,
            verificationToken: verificationToken,
            verificationDeadline: verificationDeadline,
            mainCompany: {
              create: {
                email: email.email,
                stripeId: JsonData['customer'],
                currentBusinessBillingPlanId: currentBillingPlan.id,
              },
            },
          },
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
        console.log(event.data.object);
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
