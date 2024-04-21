import {
  Controller,
  HttpCode,
  Post,
  RawBodyRequest,
  Req,
  Headers,
} from '@nestjs/common';
import { Public } from 'src/common/decorators/public.decorator';
import { WebhookStripeService } from './webhook-stripe.service';

@Controller('webhook-stripe')
export class WebhookStripeController {
  constructor(private readonly webhookStripeService: WebhookStripeService) {}
  @Public()
  @Post('webhook/stripe')
  @HttpCode(200)
  async stripeWebhook(@Req() req: RawBodyRequest<Request>, @Headers() headers) {
    return await this.webhookStripeService.stripeWebhook(req.rawBody, headers);
  }
}
