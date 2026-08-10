import { Injectable, Inject, BadRequestException } from '@nestjs/common';
import { DRIZZLE } from '../../db/drizzle.provider';
import { PostgresJsDatabase } from 'drizzle-orm/postgres-js';
import * as schema from '../../db/schema';

@Injectable()
export class ProductsService {
  constructor(
    @Inject(DRIZZLE)
    private db: PostgresJsDatabase<typeof schema>,
  ) {}

  async createProduct(body: any) {
    const { name, description, price, basePrice, storeId, categoryId, stock } = body;

    if (!categoryId) {
      throw new BadRequestException('Product create karne ke liye categoryId zaroori hai!');
    }

    const productTable = (schema as any).products || (schema as any).product;

    const finalPrice = basePrice || price || '0';

    const [newProduct] = await this.db
      .insert(productTable)
      .values({
        name,
        description: description || '',
        basePrice: String(finalPrice), // DB schema mapping for base_price
        price: String(finalPrice),     // Safe fallback agar price column bhi exist karta ho
        storeId: storeId || null,
        categoryId,
        stock: stock || 0,
      })
      .returning();

    return {
      message: 'Product successfully create ho gaya hai!',
      product: newProduct,
    };
  }

  async getAllProducts() {
    const productTable = (schema as any).products || (schema as any).product;
    return await this.db.select().from(productTable);
  }
}