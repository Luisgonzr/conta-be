import { Test, TestingModule } from '@nestjs/testing';
import { TaxCatalogService } from './tax-catalog.service';

describe('TaxCatalogService', () => {
  let service: TaxCatalogService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [TaxCatalogService],
    }).compile();

    service = module.get<TaxCatalogService>(TaxCatalogService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
