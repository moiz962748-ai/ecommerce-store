import { Injectable, Inject, NotFoundException } from '@nestjs/common';
import { DRIZZLE } from '../../db/drizzle.provider';
import { PostgresJsDatabase } from 'drizzle-orm/postgres-js';
import * as schema from '../../db/schema';
import { eq, inArray } from 'drizzle-orm';
import { UpdateStoreConfigDto } from './dto/update-store-config.dto';

@Injectable()
export class StoresService {
  constructor(
    @Inject(DRIZZLE)
    private db: PostgresJsDatabase<typeof schema>,
  ) {}

  // 1. Create a new store
  async createStore(body: any) {
    const { name, subDomain, theme } = body;

    let templateId = body.templateId;
    if (!templateId) {
      const defaultTemplate = await this.db.query.templates?.findFirst();
      templateId = defaultTemplate?.id;
    }

    const [newStore] = await this.db
      .insert(schema.stores)
      .values({
        name,
        subDomain,
        templateId,
        templateConfig: {
          theme: theme || 'boutique',
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

  // 4. Partner assignments
  async assignPartner(body: { storeId: string; userId: string }) {
    const { storeId, userId } = body;

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

  async getStoresByPartner(userId: string) {
    const assignments = await this.db.query.storePartner.findMany({
      where: eq(schema.storePartner.userId, userId),
    });

    if (!assignments || assignments.length === 0) {
      return [];
    }

    const storeIds = assignments.map((a) => a.storeId);

    return await this.db.query.stores.findMany({
      where: inArray(schema.stores.id, storeIds),
    });
  }

  // 5. Fetch store by subdomain (used by public controller)
  async getStoreBySubdomain(subdomain: string) {
    const store = await this.db.query.stores.findFirst({
      where: eq(schema.stores.subDomain, subdomain),
    });

    if (!store) {
      throw new NotFoundException(`Store with subdomain '${subdomain}' not found`);
    }

    return store;
  }

  // 6. CMS Customizer Update (By Subdomain)
  async updateStoreConfig(subdomain: string, dto: UpdateStoreConfigDto) {
    const existingStore = await this.getStoreBySubdomain(subdomain);

    const currentConfig = (existingStore.templateConfig as Record<string, any>) || {};
    const incomingConfig = (dto.templateConfig as Record<string, any>) || {};

    const updatedTemplateConfig = {
      ...currentConfig,
      ...incomingConfig,
      hero: {
        ...(currentConfig.hero || {}),
        ...(incomingConfig.hero || {}),
      },
      about: {
        ...(currentConfig.about || {}),
        ...(incomingConfig.about || {}),
      },
      contact: {
        ...(currentConfig.contact || {}),
        ...(incomingConfig.contact || {}),
      },
    };

    const updatePayload: Record<string, any> = {
      templateConfig: updatedTemplateConfig,
      updatedAt: new Date(),
    };

    if (dto.name !== undefined) updatePayload.name = dto.name;
    if (dto.logoUrl !== undefined) updatePayload.logoUrl = dto.logoUrl;

    const [updated] = await this.db
      .update(schema.stores)
      .set(updatePayload)
      .where(eq(schema.stores.subDomain, subdomain))
      .returning();

    return {
      message: 'Store configuration updated successfully!',
      store: updated,
    };
  }

  // 7. Update an existing store (By ID)
  async updateStore(id: string, body: any) {
    const updatePayload: Record<string, any> = {};

    if (body.name !== undefined) updatePayload.name = body.name;
    if (body.isActive !== undefined) updatePayload.isActive = body.isActive;

    if (body.theme) {
      const existing = await this.getStoreById(id);
      const existingConfig = (existing.templateConfig as Record<string, any>) || {};

      updatePayload.templateConfig = {
        ...existingConfig,
        theme: body.theme,
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

  // 8. Delete a store and clean up dependent records safely
  async deleteStore(id: string) {
    return await this.db.transaction(async (tx) => {
      const storeProducts = await tx
        .select({ id: schema.products.id })
        .from(schema.products)
        .where(eq(schema.products.storeId, id));

      const productIds = storeProducts.map((p) => p.id);

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

      if ('orders' in schema) {
        await tx
          .delete((schema as any).orders)
          .where(eq((schema as any).orders.storeId, id));
      }

      if ('carts' in schema) {
        await tx
          .delete((schema as any).carts)
          .where(eq((schema as any).carts.storeId, id));
      }

      await tx
        .delete(schema.products)
        .where(eq(schema.products.storeId, id));

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