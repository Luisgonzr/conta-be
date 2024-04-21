import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PrismaService } from 'src/prisma/prisma.service';
import Stripe from 'stripe';

@Injectable()
export class PlanService {
  constructor(
    private readonly configService: ConfigService,
    private readonly prismaService: PrismaService,
  ) {}
  async getPlans() {
    return await this.prismaService.businessBillingPlan.findMany();
  }
  async syncStripePlan(planId: string) {
    const stripe = new Stripe(this.configService.get('STRIPE_SECRET_KEY_TEST'));
    const billingPlan = await this.prismaService.businessBillingPlan.findUnique(
      {
        where: {
          id: planId,
        },
      },
    );
    if (!billingPlan) {
      throw new Error('Error getting plan');
    }
    const plan = await stripe.plans.create({
      amount: billingPlan.price * 100,
      currency: billingPlan.currency,
      interval: 'month',
      product: {
        name: billingPlan.name,
      },
    });
    await this.prismaService.businessBillingPlan.update({
      where: {
        id: planId,
      },
      data: {
        stripeId: plan.id,
      },
    });
    return plan;
  }
}
