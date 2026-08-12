import { Controller, Get, Param } from '@nestjs/common';
import { ProductsService } from './products.service';

@Controller('public/products')
export class PublicProductsController {
  constructor(private readonly productsService: ProductsService) {}

  @Get('store/:storeId')
  async getProductsByStore(@Param('storeId') storeId: string) {
    return await this.productsService.getProductsByStore(storeId);
  }
}