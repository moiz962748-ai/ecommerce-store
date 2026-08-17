import { Injectable, Inject, NotFoundException } from '@nestjs/common';
import { DRIZZLE } from '../../db/drizzle.provider';
import { PostgresJsDatabase } from 'drizzle-orm/postgres-js';
import * as schema from '../../db/schema';
import { products } from '../../db/schema';
import { eq } from 'drizzle-orm';
import { CreateProductDto, UpdateProductDto } from './dto/create-product.dto';
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

    const { name, description, imageUrl, basePrice, storeId, categoryId } = dto;

    const [newProduct] = await this.db
      .insert(products)
      .values({
        name,
        description: description || '',
        imageUrl: imageUrl || null,
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

  async updateProduct(id: string, dto: UpdateProductDto, currentUser: { userId: string; role: string }) {
    const existingProduct = await this.db.query.products.findFirst({
      where: eq(products.id, id),
    });

    if (!existingProduct) {
      throw new NotFoundException('Product not found');
    }

    const targetStoreId = dto.storeId ?? existingProduct.storeId;
    await this.storeAccessService.assertStoreAccess(currentUser.userId, currentUser.role, targetStoreId);

    const [updatedProduct] = await this.db
      .update(products)
      .set({
        name: dto.name ?? existingProduct.name,
        description: dto.description ?? existingProduct.description,
        imageUrl: dto.imageUrl === '' ? null : (dto.imageUrl ?? existingProduct.imageUrl),
        basePrice: dto.basePrice !== undefined ? Number(dto.basePrice) : existingProduct.basePrice,
        storeId: dto.storeId ?? existingProduct.storeId,
        categoryId: dto.categoryId ?? existingProduct.categoryId,
      })
      .where(eq(products.id, id))
      .returning();

    return {
      message: 'Product updated successfully!',
      product: updatedProduct,
    };
  }

  async deleteProduct(id: string, currentUser: { userId: string; role: string }) {
    const existingProduct = await this.db.query.products.findFirst({
      where: eq(products.id, id),
    });

    if (!existingProduct) {
      throw new NotFoundException('Product not found');
    }

    // Verify if the partner/admin has permission to delete from this store
    await this.storeAccessService.assertStoreAccess(
      currentUser.userId,
      currentUser.role,
      existingProduct.storeId,
    );

    const [deletedProduct] = await this.db
      .delete(products)
      .where(eq(products.id, id))
      .returning();

    return {
      message: 'Product deleted successfully!',
      product: deletedProduct,
    };
  }

  async getAllProducts() {
    return await this.db.select().from(products);
  }

  async getProductsByStore(storeId: string) {
    return await this.db.select().from(products).where(eq(products.storeId, storeId));
  }
}