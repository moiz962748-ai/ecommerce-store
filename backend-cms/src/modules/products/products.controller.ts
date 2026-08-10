import { Controller, Post, Get, Body, UseGuards } from '@nestjs/common';
import { ProductsService } from './products.service';
import { AuthGuard } from '@nestjs/passport';
import { RolesGuard } from '../auth/roles.guard';
import { Roles } from '../auth/roles.decorator';
import { CreateProductDto } from './dto/create-product.dto';

@Controller('products')
@UseGuards(AuthGuard('jwt'), RolesGuard)
export class ProductsController {
  constructor(private readonly productsService: ProductsService) {}

  // ADMIN aur PARTNER products add kar sakte hain
  @Post()
@Roles('ADMIN', 'PARTNER')
async createProduct(@Body() dto: CreateProductDto) {
  return await this.productsService.createProduct(dto);
}

  // Saare products dekhne ke liye
  @Get()
  @Roles('ADMIN', 'PARTNER', 'CUSTOMER')
  async getAllProducts() {
    return await this.productsService.getAllProducts();
  }
}