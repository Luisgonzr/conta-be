import { Test, TestingModule } from '@nestjs/testing';
import { TaxCatalogController } from './tax-catalog.controller';

describe('TaxCatalogController', () => {
  let controller: TaxCatalogController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [TaxCatalogController],
    }).compile();

    controller = module.get<TaxCatalogController>(TaxCatalogController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
