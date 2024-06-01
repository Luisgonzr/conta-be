import { Body, Controller, Post, UseGuards } from '@nestjs/common';
import { User } from 'src/common/decorators/user.decorator';
import { JwtAuthGuard } from 'src/common/guards/jwt-auth.guard';
import { UserInfo } from 'src/common/interfaces/user.info';
import { CheckoutStripeService } from './checkout-stripe.service';
import { Public } from 'src/common/decorators/public.decorator';

//@UseGuards(JwtAuthGuard)
@Controller('checkout-stripe')
export class CheckoutStripeController {
  constructor(private readonly checkoutStripeService: CheckoutStripeService) {}

  @Post('do-checkout')
  async stripeCheckout(@User() user: UserInfo, @Body('planId') planId: string) {
    return await this.checkoutStripeService.stripeCheckout(
      user.currentCompany,
      planId,
    );
  }

  @Public()
  @Post('checkout')
  async checkout(@Body('planId') planId: string) {
    return await this.checkoutStripeService.checkoutFromLandingPage(planId);
  }

}
