import { Injectable, Inject, NotFoundException } from '@nestjs/common';
import { DRIZZLE } from '../../db/drizzle.provider';
import { PostgresJsDatabase } from 'drizzle-orm/postgres-js';
import * as schema from '../../db/schema';
import { products, productVariant } from '../../db/schema';
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

    const { name, description, imageUrl, basePrice, storeId, categoryId, variants } = dto;

    // 1. Create Parent Product
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

    // 2. Insert Variants if provided
    let insertedVariants: any[] = [];
    if (variants && variants.length > 0) {
      const variantRecords = variants.map((v, index) => ({
        productId: newProduct.id,
        name: v.name,
        description: v.description || null,
        imageUrl: v.imageUrl || imageUrl || null,
        price: Number(v.price),
        sku:
          v.sku && v.sku.trim() !== ''
            ? v.sku
            : `${newProduct.id.slice(0, 6).toUpperCase()}-VAR-${index + 1}-${Date.now().toString().slice(-4)}`,
        stock: v.stock !== undefined ? Number(v.stock) : 10,
      }));

      insertedVariants = await this.db
        .insert(productVariant)
        .values(variantRecords)
        .returning();
    }

    return {
      message: 'Product created successfully!',
      product: {
        ...newProduct,
        price: Number(newProduct.basePrice),
        variants: insertedVariants,
      },
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

    // 1. Update Parent Product
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

    // 2. Re-sync Variants if provided
    if (dto.variants) {
      await this.db.delete(productVariant).where(eq(productVariant.productId, id));

      if (dto.variants.length > 0) {
        const variantRecords = dto.variants.map((v, index) => ({
          productId: id,
          name: v.name,
          description: v.description || null,
          imageUrl: v.imageUrl || updatedProduct.imageUrl || null,
          price: Number(v.price),
          sku:
            v.sku && v.sku.trim() !== ''
              ? v.sku
              : `${id.slice(0, 6).toUpperCase()}-VAR-${index + 1}-${Date.now().toString().slice(-4)}`,
          stock: v.stock !== undefined ? Number(v.stock) : 10,
        }));

        await this.db.insert(productVariant).values(variantRecords);
      }
    }

    const variantsList = await this.db
      .select()
      .from(productVariant)
      .where(eq(productVariant.productId, id));

    return {
      message: 'Product updated successfully!',
      product: {
        ...updatedProduct,
        price: Number(updatedProduct.basePrice),
        variants: variantsList,
      },
    };
  }

  async deleteProduct(id: string, currentUser: { userId: string; role: string }) {
    const existingProduct = await this.db.query.products.findFirst({
      where: eq(products.id, id),
    });

    if (!existingProduct) {
      throw new NotFoundException('Product not found');
    }

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
    const allProducts = await this.db.select().from(products);
    const allVariants = await this.db.select().from(productVariant);

    return allProducts.map((prod) => {
      const prodVariants = allVariants.filter((v) => v.productId === prod.id);
      const computedPrice = prod.basePrice ?? (prodVariants.length > 0 ? prodVariants[0].price : 0);

      return {
        ...prod,
        price: Number(computedPrice),
        basePrice: Number(prod.basePrice),
        variants: prodVariants,
      };
    });
  }

  async getProductsByStore(storeId: string) {
    const storeProducts = await this.db
      .select()
      .from(products)
      .where(eq(products.storeId, storeId));

    const allVariants = await this.db.select().from(productVariant);

    return storeProducts.map((prod) => {
      const prodVariants = allVariants.filter((v) => v.productId === prod.id);
      const computedPrice = prod.basePrice ?? (prodVariants.length > 0 ? prodVariants[0].price : 0);

      return {
        ...prod,
        price: Number(computedPrice),
        basePrice: Number(prod.basePrice),
        variants: prodVariants,
      };
    });
  }

  async getProductById(id: string) {
    const product = await this.db.query.products.findFirst({
      where: eq(products.id, id),
    });

    if (!product) {
      throw new NotFoundException('Product not found');
    }

    const variants = await this.db
      .select()
      .from(productVariant)
      .where(eq(productVariant.productId, id));

    const computedPrice = product.basePrice ?? (variants.length > 0 ? variants[0].price : 0);

    return {
      ...product,
      price: Number(computedPrice),
      basePrice: Number(product.basePrice),
      variants: variants || [],
    };
  }
}