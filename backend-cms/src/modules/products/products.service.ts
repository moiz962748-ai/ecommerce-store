import { Injectable, Inject, BadRequestException } from '@nestjs/common';
import { DRIZZLE } from '../../db/drizzle.provider';
import { PostgresJsDatabase } from 'drizzle-orm/postgres-js';
import * as schema from '../../db/schema';
import { products } from '../../db/schema';

@Injectable()
export class ProductsService {
  constructor(
    @Inject(DRIZZLE)
    private db: PostgresJsDatabase<typeof schema>,
  ) {}

  async createProduct(body: any) {
    const { name, description, price, basePrice, storeId, categoryId } = body;

    if (!categoryId) {
      throw new BadRequestException('Product create karne ke liye categoryId zaroori hai!');
    }

    if (!storeId) {
      throw new BadRequestException('Product create karne ke liye storeId zaroori hai!');
    }

    const finalPrice = basePrice || price || '0';

    const [newProduct] = await this.db
      .insert(products)
      .values({
        name,
        description: description || '',
        basePrice: Number(finalPrice),
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