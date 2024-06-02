import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PrismaService } from 'src/prisma/prisma.service';
import Stripe from 'stripe';

@Injectable()
export class CheckoutStripeService {
  constructor(
    private readonly configService: ConfigService,
    private readonly prismaService: PrismaService,
  ) {}

  async checkoutFromLandingPage(planId: string) {
    const plan = await this.prismaService.businessBillingPlan
      .findUnique({
        where: {
          id: planId,
        },
      })
      .catch((error) => {
        console.log(error);
        throw new Error('Error getting plan');
      });
    if (!plan) {
      throw new Error('Error getting plan');
    }
    const stripe = new Stripe(this.configService.get('STRIPE_SECRET_KEY_TEST'));
    if (plan.isFree) {
      const session = await stripe.checkout.sessions.create({
        payment_method_types: ['card'],
        line_items: [
          {
            price: plan.stripeId,
            quantity: 1,
          },
        ],
        payment_method_collection: 'if_required',
        mode: 'subscription', //'payment
        success_url: this.configService.get('STRIPE_SUCCESS_URL'),
        cancel_url: this.configService.get(
          'STRIPE_LANDING_CHECKOUT_CANCEL_URL ',
        ),
      });
      if (!session) {
        throw new Error('Error creating session');
      }
      return session;
    } else {
      const session = await stripe.checkout.sessions.create({
        payment_method_types: ['card'],
        line_items: [
          {
            price: plan.stripeId,
            quantity: 1,
          },
        ],
        mode: 'subscription', //'payment
        success_url: this.configService.get('STRIPE_SUCCESS_URL'),
        cancel_url: this.configService.get(
          'STRIPE_LANDING_CHECKOUT_CANCEL_URL',
        ),
      });
      if (!session) {
        throw new Error('Error creating session');
      }
      return session;
    }
  }

  async stripeCheckout(companyId: string, planId: string) {
    const plan = await this.prismaService.businessBillingPlan
      .findUnique({
        where: {
          id: planId,
        },
      })
      .catch((error) => {
        console.log(error);
        throw new Error('Error getting plan');
      });
    if (!plan) {
      throw new Error('Error getting plan');
    }
    if (plan.isFree) {
      return {
        message: 'Free plan',
      };
    }
    const stripe = new Stripe(this.configService.get('STRIPE_SECRET_KEY_TEST'));
    const customer = await this.prismaService.company
      .findUnique({
        where: {
          id: companyId,
        },
      })
      .catch((error) => {
        console.log(error);
        throw new Error('Error getting company');
      });
    console.log('Customer:', customer);
    if (!customer) {
      throw new Error('Error getting company');
    }
    const customerStripe = await stripe.customers.create({
      name: customer.name,
      email: customer.email,
    });
    await this.prismaService.company
      .update({
        where: {
          id: companyId,
        },
        data: {
          stripeId: customerStripe.id,
        },
      })
      .catch((error) => {
        console.log(error);
        throw new Error('Error updating company');
      });
    if (!customer) {
      throw new Error('Error creating customer');
    }
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      line_items: [
        {
          price: plan.stripeId,
          quantity: 1,
        },
      ],
      customer: customer.stripeId,
      client_reference_id: companyId,
      mode: 'subscription', //'payment',
      success_url: this.configService.get('STRIPE_SUCCESS_URL'),
      cancel_url: this.configService.get('STRIPE_CANCEL_URL'),
    });
    const checkout = await this.prismaService.stripeCheckout.create({
      data: {
        companyId: customer.id,
        stripeId: session.id,
        amountTotal: session.amount_total,
        cancelUrl: session.cancel_url,
        successUrl: session.success_url,
        currency: session.currency,
        paymentStatus: session.payment_status,
        url: session.url,
        status: session.status,
        subscription: session.subscription as string | null,
        clientReferenceId: session.client_reference_id,
      },
    });
    if (!checkout) {
      throw new Error('Error creating checkout');
    }
    return checkout;
  }
}
