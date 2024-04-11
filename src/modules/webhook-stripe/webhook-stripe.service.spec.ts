import { Test, TestingModule } from '@nestjs/testing';
import { WebhookStripeService } from './webhook-stripe.service';

describe('WebhookStripeService', () => {
  let service: WebhookStripeService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [WebhookStripeService],
    }).compile();

    service = module.get<WebhookStripeService>(WebhookStripeService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
