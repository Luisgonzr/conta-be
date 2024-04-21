import { Module } from '@nestjs/common';
import { ProductAndServiceCategoryController } from './product-and-service-category.controller';
import { ProductAndServiceCategoryService } from './product-and-service-category.service';

@Module({
  controllers: [ProductAndServiceCategoryController],
  providers: [ProductAndServiceCategoryService]
})
export class ProductAndServiceCategoryModule {}
