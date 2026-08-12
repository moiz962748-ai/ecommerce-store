import { Injectable, Inject } from '@nestjs/common';
import { DRIZZLE } from '../../db/drizzle.provider';
import { PostgresJsDatabase } from 'drizzle-orm/postgres-js';
import * as schema from '../../db/schema';
import { products } from '../../db/schema';
import { eq } from 'drizzle-orm';
import { CreateProductDto } from './dto/create-product.dto';
import { StoreAccessService } from '../../common/store-access.service';

@Injectable()
export class ProductsService {
  constructor(
    @Inject(DRIZZLE)
    private db: PostgresJsDatabase<typeof schema>,
    private storeAccessService: StoreAccessService,
  ) {}

  async createProduct(dto: CreateProductDto, currentUser: { userId: string; role: string }) {
    await this.storeAccessService.assertStoreAccess(currentUser.userId, currentUser.role, dto.storeId);

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
      message: 'Product created successfully!',
      product: newProduct,
    };
  }

  async getAllProducts() {
    return await this.db.select().from(products);
  }

  async getProductsByStore(storeId: string) {
    return await this.db.select().from(products).where(eq(products.storeId, storeId));
  }
}