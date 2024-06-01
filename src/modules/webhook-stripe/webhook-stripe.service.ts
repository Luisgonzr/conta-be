import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PrismaService } from 'src/prisma/prisma.service';
import { MomentMeasurements, UtilsService } from 'src/shared/utils/utils.service';
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
        console.log(event.data.object);
        const marketingEmail = await this.prismaService.marketingEmail
          .create({
            data: {
              email: event.data.object.email,
              stripeId: event.data.object.id,
            },
          })
          .catch((error) => {
            console.log(error);
            throw new Error('Error creating email');
          });
      case 'customer.subscription.created':
        console.log(event.data.object);
        const email = await this.prismaService.marketingEmail.findFirst({
          where: {
            stripeId: event.data.object.customer,
          },
        });
        const verificationToken = await this.utilsService.generateRandomString(32);
        const verificationDeadline = this.utilsService.getExpirationDate(
          5,
          MomentMeasurements.days,
        );
        await this.prismaService.userMain.create({
          data: {
            email: email.email,
            verificationToken: verificationToken,
            verificationDeadline: verificationDeadline,
            mainCompany: {
              create: {
                email: email.email,
                stripeId: event.data.object.customer,
                currentBusinessBillingPlanId: event.data.object.plan.id,
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
            event: JSON.stringify(paymentIntent),
          },
        });
        break;
      case 'checkout.session.completed':
        console.log(event.data.object);
        const paymentMethodA = event.data.object;
        await this.prismaService.webhookDummy.create({
          data: {
            type: event.type,
            event: JSON.stringify(paymentIntent),
          },
        });
        break;
      case 'payment_intent.created':
        console.log(event.data.object);
        const paymentMethodB = event.data.object;
        await this.prismaService.webhookDummy.create({
          data: {
            type: event.type,
            event: JSON.stringify(paymentIntent),
          },
        });
        break;
      default:
        console.log(event.data.object);
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
