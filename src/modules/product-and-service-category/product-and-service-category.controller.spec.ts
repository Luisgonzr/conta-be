import { Test, TestingModule } from '@nestjs/testing';
import { ProductAndServiceCategoryController } from './product-and-service-category.controller';

describe('ProductAndServiceCategoryController', () => {
  let controller: ProductAndServiceCategoryController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [ProductAndServiceCategoryController],
    }).compile();

    controller = module.get<ProductAndServiceCategoryController>(ProductAndServiceCategoryController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
