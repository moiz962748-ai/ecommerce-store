import { Injectable, Inject } from '@nestjs/common';
import { DRIZZLE } from '../../db/drizzle.provider';
import { PostgresJsDatabase } from 'drizzle-orm/postgres-js';
import * as schema from '../../db/schema';
import { products } from '../../db/schema';
import { CreateProductDto } from './dto/create-product.dto';

@Injectable()
export class ProductsService {
  constructor(
    @Inject(DRIZZLE)
    private db: PostgresJsDatabase<typeof schema>,
  ) {}

  async createProduct(dto: CreateProductDto) {
    const { name, description, basePrice, storeId, categoryId } = dto;

    const [newProduct] = await this.db
      .insert(products)
      .values({
        name,
        description: description || '',
        basePrice: Number(basePrice),
        storeId,
        categoryId,
      })
      .returning();

    return {
      message: 'Product successfully create ho gaya hai!',
      product: newProduct,
    };
  }

  async getAllProducts() {
    return await this.db.select().from(products);
  }
}