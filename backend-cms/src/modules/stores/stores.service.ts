import { Injectable, Inject, NotFoundException } from '@nestjs/common';
import { DRIZZLE } from '../../db/drizzle.provider';
import { PostgresJsDatabase } from 'drizzle-orm/postgres-js';
import * as schema from '../../db/schema';
import { eq, inArray } from 'drizzle-orm';

@Injectable()
export class StoresService {
  constructor(
    @Inject(DRIZZLE)
    private db: PostgresJsDatabase<typeof schema>,
  ) {}

  // 1. Create a new store
  async createStore(body: any) {
    const { name, subDomain, theme, mode } = body;

    const [newStore] = await this.db
      .insert(schema.stores)
      .values({
        name,
        subDomain,
        templateConfig: {
          theme: theme || 'default',
          mode: mode || 'dark',
        },
      })
      .returning();

    return {
      message: 'Store created successfully!',
      store: newStore,
    };
  }

  // 2. Fetch all stores
  async getAllStores() {
    return await this.db.query.stores.findMany();
  }

  // 3. Fetch single store by ID
  async getStoreById(id: string) {
    const store = await this.db.query.stores.findFirst({
      where: eq(schema.stores.id, id),
    });

    if (!store) {
      throw new NotFoundException(`Store with ID ${id} not found`);
    }

    return store;
  }

  // Inside StoresService class:

async assignPartner(body: { storeId: string; userId: string }) {
  const { storeId, userId } = body;

  // Insert assignment into the storePartner table
  const [assignment] = await this.db
    .insert(schema.storePartner)
    .values({
      storeId,
      userId,
    })
    .returning();

  return {
    message: 'Partner assigned successfully!',
    assignment,
  };
}

// Inside StoresService class:

async getStoresByPartner(userId: string) {
  // Find all store assignments for this user
  const assignments = await this.db.query.storePartner.findMany({
    where: eq(schema.storePartner.userId, userId),
  });

  if (!assignments || assignments.length === 0) {
    return [];
  }

  const storeIds = assignments.map((a) => a.storeId);

  // Fetch the actual store records
  return await this.db.query.stores.findMany({
    where: inArray(schema.stores.id, storeIds),
  });
}
  // 4. Fetch store by subdomain (used by public controller)
  async getStoreBySubdomain(subdomain: string) {
    const store = await this.db.query.stores.findFirst({
      where: eq(schema.stores.subDomain, subdomain),
    });

    if (!store) {
      throw new NotFoundException(`Store with subdomain '${subdomain}' not found`);
    }

    return store;
  }

  // 5. Update an existing store
  async updateStore(id: string, body: any) {
    const updatePayload: Record<string, any> = {};

    if (body.name !== undefined) updatePayload.name = body.name;
    if (body.isActive !== undefined) updatePayload.isActive = body.isActive;

    if (body.theme || body.mode) {
      const existing = await this.getStoreById(id);
      const existingConfig = (existing.templateConfig as Record<string, any>) || {};

      updatePayload.templateConfig = {
        ...existingConfig,
        ...(body.theme ? { theme: body.theme } : {}),
        ...(body.mode ? { mode: body.mode } : {}),
      };
    }

    const [updatedStore] = await this.db
      .update(schema.stores)
      .set(updatePayload)
      .where(eq(schema.stores.id, id))
      .returning();

    if (!updatedStore) {
      throw new NotFoundException(`Store with ID ${id} not found`);
    }

    return {
      message: 'Store updated successfully!',
      store: updatedStore,
    };
  }

  // 6. Delete a store and clean up dependent records safely
  async deleteStore(id: string) {
    return await this.db.transaction(async (tx) => {
      // Step A: Find all products associated with this store
      const storeProducts = await tx
        .select({ id: schema.products.id })
        .from(schema.products)
        .where(eq(schema.products.storeId, id));

      const productIds = storeProducts.map((p) => p.id);

      // Step B: Delete order items and cart items linked to store's products if present in schema
      if (productIds.length > 0) {
        if ('orderItems' in schema) {
          await tx
            .delete((schema as any).orderItems)
            .where(inArray((schema as any).orderItems.productId, productIds));
        }

        if ('cartItems' in schema) {
          await tx
            .delete((schema as any).cartItems)
            .where(inArray((schema as any).cartItems.productId, productIds));
        }
      }

      // Step C: Delete orders linked directly to this store
      if ('orders' in schema) {
        await tx
          .delete((schema as any).orders)
          .where(eq((schema as any).orders.storeId, id));
      }

      // Step D: Delete carts linked directly to this store
      if ('carts' in schema) {
        await tx
          .delete((schema as any).carts)
          .where(eq((schema as any).carts.storeId, id));
      }

      // Step E: Delete products of this store
      await tx
        .delete(schema.products)
        .where(eq(schema.products.storeId, id));

      // Step F: Delete the store record
      const [deletedStore] = await tx
        .delete(schema.stores)
        .where(eq(schema.stores.id, id))
        .returning();

      if (!deletedStore) {
        throw new NotFoundException(`Store with ID ${id} not found`);
      }

      return {
        message: 'Store and all associated data deleted successfully!',
        store: deletedStore,
      };
    });
  }
}