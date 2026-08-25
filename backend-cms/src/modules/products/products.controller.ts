import {
  Controller,
  Post,
  Get,
  Patch,
  Delete,
  Body,
  Param,
  UseGuards,
  Req,
} from '@nestjs/common';
import { ProductsService } from './products.service';
import { AuthGuard } from '@nestjs/passport';
import { RolesGuard } from '../auth/roles.guard';
import { Roles } from '../auth/roles.decorator';
import { CreateProductDto, UpdateProductDto } from './dto/create-product.dto';

@Controller('products')
export class ProductsController {
  constructor(private readonly productsService: ProductsService) {}

  // 1. PUBLIC: Single Product with Variants fetch karne ke liye
  @Get(':id')
  async getProductById(@Param('id') id: string) {
    return await this.productsService.getProductById(id);
  }

  // 2. PUBLIC: All Products fetch karne ke liye
  @Get()
  async getAllProducts() {
    return await this.productsService.getAllProducts();
  }

  // 3. PUBLIC: Store specific products fetch karne ke liye
  @Get('store/:storeId')
  async getProductsByStore(@Param('storeId') storeId: string) {
    return await this.productsService.getProductsByStore(storeId);
  }

  // 4. PROTECTED: Admin ya Partner ke liye Create Product
  @Post()
  @UseGuards(AuthGuard('jwt'), RolesGuard)
  @Roles('ADMIN', 'PARTNER')
  async createProduct(@Body() dto: CreateProductDto, @Req() req: any) {
    return await this.productsService.createProduct(dto, req.user);
  }

  // 5. PROTECTED: Admin ya Partner ke liye Update Product
  @Patch(':id')
  @UseGuards(AuthGuard('jwt'), RolesGuard)
  @Roles('ADMIN', 'PARTNER')
  async updateProduct(
    @Param('id') id: string,
    @Body() dto: UpdateProductDto,
    @Req() req: any,
  ) {
    return await this.productsService.updateProduct(id, dto, req.user);
  }

  // 6. PROTECTED: Admin ya Partner ke liye Delete Product
  @Delete(':id')
  @UseGuards(AuthGuard('jwt'), RolesGuard)
  @Roles('ADMIN', 'PARTNER')
  async deleteProduct(@Param('id') id: string, @Req() req: any) {
    return await this.productsService.deleteProduct(id, req.user);
  }
}