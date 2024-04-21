import { Test, TestingModule } from '@nestjs/testing';
import { ProductAndServiceCategoryService } from './product-and-service-category.service';

describe('ProductAndServiceCategoryService', () => {
  let service: ProductAndServiceCategoryService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [ProductAndServiceCategoryService],
    }).compile();

    service = module.get<ProductAndServiceCategoryService>(ProductAndServiceCategoryService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
