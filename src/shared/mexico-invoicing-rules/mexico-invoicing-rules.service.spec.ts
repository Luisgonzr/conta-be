import { Test, TestingModule } from '@nestjs/testing';
import { MexicoInvoicingRulesService } from './mexico-invoicing-rules.service';

describe('MexicoInvoicingRulesService', () => {
  let service: MexicoInvoicingRulesService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [MexicoInvoicingRulesService],
    }).compile();

    service = module.get<MexicoInvoicingRulesService>(MexicoInvoicingRulesService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
