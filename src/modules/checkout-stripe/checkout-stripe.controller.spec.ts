import { Test, TestingModule } from '@nestjs/testing';
import { CheckoutStripeController } from './checkout-stripe.controller';

describe('CheckoutStripeController', () => {
  let controller: CheckoutStripeController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [CheckoutStripeController],
    }).compile();

    controller = module.get<CheckoutStripeController>(CheckoutStripeController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
