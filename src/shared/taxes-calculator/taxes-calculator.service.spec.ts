import { Test, TestingModule } from '@nestjs/testing';
import { TaxesCalculatorService } from './taxes-calculator.service';

describe('TaxesCalculatorService', () => {
  let service: TaxesCalculatorService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [TaxesCalculatorService],
    }).compile();

    service = module.get<TaxesCalculatorService>(TaxesCalculatorService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
