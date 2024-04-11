import { Test, TestingModule } from '@nestjs/testing';
import { WebhookStripeController } from './webhook-stripe.controller';

describe('WebhookStripeController', () => {
  let controller: WebhookStripeController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [WebhookStripeController],
    }).compile();

    controller = module.get<WebhookStripeController>(WebhookStripeController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
