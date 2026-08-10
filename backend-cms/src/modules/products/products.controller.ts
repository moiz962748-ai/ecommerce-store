import { Controller, Post, Get, Body, UseGuards } from '@nestjs/common';
import { ProductsService } from './products.service';
import { AuthGuard } from '@nestjs/passport';
import { RolesGuard } from '../auth/roles.guard';
import { Roles } from '../auth/roles.decorator';

@Controller('products')
@UseGuards(AuthGuard('jwt'), RolesGuard)
export class ProductsController {
  constructor(private readonly productsService: ProductsService) {}

  // ADMIN aur PARTNER products add kar sakte hain
  @Post()
  @Roles('ADMIN', 'PARTNER')
  async createProduct(@Body() body: any) {
    return await this.productsService.createProduct(body);
  }

  // Saare products dekhne ke liye
  @Get()
  @Roles('ADMIN', 'PARTNER', 'CUSTOMER')
  async getAllProducts() {
    return await this.productsService.getAllProducts();
  }
}