import { Test, TestingModule } from '@nestjs/testing';
import { CheckoutStripeService } from './checkout-stripe.service';

describe('CheckoutStripeService', () => {
  let service: CheckoutStripeService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [CheckoutStripeService],
    }).compile();

    service = module.get<CheckoutStripeService>(CheckoutStripeService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
