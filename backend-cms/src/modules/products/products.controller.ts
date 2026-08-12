import { Controller, Post, Get, Body, Param, UseGuards, Req } from '@nestjs/common';
import { ProductsService } from './products.service';
import { AuthGuard } from '@nestjs/passport';
import { RolesGuard } from '../auth/roles.guard';
import { Roles } from '../auth/roles.decorator';
import { CreateProductDto } from './dto/create-product.dto';

@Controller('products')
@UseGuards(AuthGuard('jwt'), RolesGuard)
export class ProductsController {
  constructor(private readonly productsService: ProductsService) {}

  @Post()
  @Roles('ADMIN', 'PARTNER')
  async createProduct(@Body() dto: CreateProductDto, @Req() req: any) {
    return await this.productsService.createProduct(dto, req.user);
  }

  @Get()
  @Roles('ADMIN', 'PARTNER', 'CUSTOMER')
  async getAllProducts() {
    return await this.productsService.getAllProducts();
  }

  @Get('store/:storeId')
  @Roles('ADMIN', 'PARTNER', 'CUSTOMER')
  async getProductsByStore(@Param('storeId') storeId: string) {
    return await this.productsService.getProductsByStore(storeId);
  }
}