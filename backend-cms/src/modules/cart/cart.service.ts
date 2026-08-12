import { Injectable, Inject, NotFoundException, ForbiddenException } from '@nestjs/common';
import { DRIZZLE } from '../../db/drizzle.provider';
import { PostgresJsDatabase } from 'drizzle-orm/postgres-js';
import * as schema from '../../db/schema';
import { eq, and } from 'drizzle-orm';

@Injectable()
export class CartService {
  constructor(
    @Inject(DRIZZLE)
    private db: PostgresJsDatabase<typeof schema>,
  ) {}

  private async getOrCreateDefaultVariant(productId: string) {
    const existing = await this.db.query.productVariant.findFirst({
      where: eq(schema.productVariant.productId, productId),
    });
    if (existing) {
      return existing;
    }

    const product = await this.db.query.products.findFirst({
      where: eq(schema.products.id, productId),
    });
    if (!product) {
      throw new NotFoundException('Product not found');
    }

    const [created] = await this.db
      .insert(schema.productVariant)
      .values({
        productId,
        name: 'Default',
        price: product.basePrice,
        sku: `${productId.slice(0, 8)}-DEFAULT`,
        stock: 999,
      })
      .returning();

    return created;
  }

  async addToCart(userId: string, productId: string, quantity: number) {
    const variant = await this.getOrCreateDefaultVariant(productId);

    const existingItem = await this.db.query.cart.findFirst({
      where: and(
        eq(schema.cart.userId, userId),
        eq(schema.cart.productVariantId, variant.id),
      ),
    });

    if (existingItem) {
      const [updated] = await this.db
        .update(schema.cart)
        .set({ quantity: existingItem.quantity + quantity })
        .where(eq(schema.cart.id, existingItem.id))
        .returning();
      return updated;
    }

    const [newItem] = await this.db
      .insert(schema.cart)
      .values({ userId, productVariantId: variant.id, quantity })
      .returning();
    return newItem;
  }

  async getCart(userId: string) {
    const result = await this.db
      .select({
        id: schema.cart.id,
        quantity: schema.cart.quantity,
        variantId: schema.productVariant.id,
        variantName: schema.productVariant.name,
        price: schema.productVariant.price,
        productId: schema.products.id,
        productName: schema.products.name,
      })
      .from(schema.cart)
      .innerJoin(schema.productVariant, eq(schema.cart.productVariantId, schema.productVariant.id))
      .innerJoin(schema.products, eq(schema.productVariant.productId, schema.products.id))
      .where(eq(schema.cart.userId, userId));

    return result;
  }

  async removeFromCart(cartItemId: string, userId: string) {
    const item = await this.db.query.cart.findFirst({
      where: eq(schema.cart.id, cartItemId),
    });

    if (!item) {
      throw new NotFoundException('Cart item not found');
    }
    if (item.userId !== userId) {
      throw new ForbiddenException('This is not your cart item');
    }

    await this.db.delete(schema.cart).where(eq(schema.cart.id, cartItemId));
    return { message: 'Item removed from cart' };
  }
}