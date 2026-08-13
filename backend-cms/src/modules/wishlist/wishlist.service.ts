import { Injectable, Inject, NotFoundException, ForbiddenException, ConflictException } from '@nestjs/common';
import { DRIZZLE } from '../../db/drizzle.provider';
import { PostgresJsDatabase } from 'drizzle-orm/postgres-js';
import * as schema from '../../db/schema';
import { eq, and } from 'drizzle-orm';

@Injectable()
export class WishlistService {
  constructor(
    @Inject(DRIZZLE)
    private db: PostgresJsDatabase<typeof schema>,
  ) {}

  // Same "get or create a default variant" logic as CartService, so
  // wishlisting a product works the same way adding it to cart does.
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

  async addToWishlist(userId: string, productId: string) {
    const variant = await this.getOrCreateDefaultVariant(productId);

    const existingItem = await this.db.query.favouriteWishlist.findFirst({
      where: and(
        eq(schema.favouriteWishlist.userId, userId),
        eq(schema.favouriteWishlist.productVariantId, variant.id),
      ),
    });

    if (existingItem) {
      // Already wishlisted — nothing to do, just return the existing row.
      return existingItem;
    }

    const [newItem] = await this.db
      .insert(schema.favouriteWishlist)
      .values({ userId, productVariantId: variant.id })
      .returning();
    return newItem;
  }

  async getWishlist(userId: string) {
    const result = await this.db
      .select({
        id: schema.favouriteWishlist.id,
        variantId: schema.productVariant.id,
        variantName: schema.productVariant.name,
        price: schema.productVariant.price,
        productId: schema.products.id,
        productName: schema.products.name,
        imageUrl: schema.products.imageUrl,
      })
      .from(schema.favouriteWishlist)
      .innerJoin(
        schema.productVariant,
        eq(schema.favouriteWishlist.productVariantId, schema.productVariant.id),
      )
      .innerJoin(schema.products, eq(schema.productVariant.productId, schema.products.id))
      .where(eq(schema.favouriteWishlist.userId, userId));

    return result;
  }

  async removeFromWishlist(wishlistItemId: string, userId: string) {
    const item = await this.db.query.favouriteWishlist.findFirst({
      where: eq(schema.favouriteWishlist.id, wishlistItemId),
    });

    if (!item) {
      throw new NotFoundException('Wishlist item not found');
    }
    if (item.userId !== userId) {
      throw new ForbiddenException('This is not your wishlist item');
    }

    await this.db.delete(schema.favouriteWishlist).where(eq(schema.favouriteWishlist.id, wishlistItemId));
    return { message: 'Item removed from wishlist' };
  }
}