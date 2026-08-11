import { Injectable, Inject, ConflictException } from '@nestjs/common';
import { DRIZZLE } from '../../db/drizzle.provider';
import { PostgresJsDatabase } from 'drizzle-orm/postgres-js';
import * as schema from '../../db/schema';
import { eq } from 'drizzle-orm';
import { StoreAccessService } from '../../common/store-access.service';
import { CreateStoreDto } from './dto/create-store.dto';
import { UpdateStoreDto } from './dto/update-store.dto';

@Injectable()
export class StoresService {
  constructor(
    @Inject(DRIZZLE)
    private db: PostgresJsDatabase<typeof schema>,
    private storeAccessService: StoreAccessService,
  ) {}

  private async getOrCreateDefaultTemplate() {
    const existing = await this.db.query.templates.findFirst();
    if (existing) {
      return existing;
    }

    const [created] = await this.db
      .insert(schema.templates)
      .values({
        name: 'Default Store Template',
        description: 'Standard multi-tenant CMS store template',
        fieldSchema: {},
      })
      .returning();

    if (!created) {
      throw new Error('Failed to create default template');
    }

    return created;
  }

  async createStore(dto: CreateStoreDto) {
    const { name, slug, subDomain, templateId, logoUrl, templateConfig } = dto;

    const finalSubDomain = subDomain || slug;

    if (!finalSubDomain) {
      throw new ConflictException('Either subDomain or slug must be provided!');
    }

    const existingStore = await this.db.query.stores.findFirst({
      where: eq(schema.stores.subDomain, finalSubDomain),
    });

    if (existingStore) {
      throw new ConflictException('A store with this subDomain/slug already exists!');
    }

    let activeTemplateId = templateId;

    if (!activeTemplateId) {
      const defaultTemplate = await this.getOrCreateDefaultTemplate();
      activeTemplateId = defaultTemplate.id;
    }

    const [newStore] = await this.db
      .insert(schema.stores)
      .values({
        name,
        subDomain: finalSubDomain,
        templateId: activeTemplateId,
        logoUrl: logoUrl || null,
        templateConfig: templateConfig || {},
      })
      .returning();

    return {
      message: 'Store created successfully!',
      store: newStore,
    };
  }

  async getAllStores() {
    return await this.db.query.stores.findMany();
  }

  async assignPartnerToStore(body: any) {
    const { storeId, partnerId, userId } = body;

    const [assignment] = await this.db
      .insert(schema.storePartner)
      .values({
        storeId,
        userId: partnerId || userId,
      })
      .returning();

    return {
      message: 'Partner assigned to store successfully!',
      assignment,
    };
  }

  async updateStore(storeId: string, dto: UpdateStoreDto, currentUser: { userId: string; role: string }) {
    await this.storeAccessService.assertStoreAccess(currentUser.userId, currentUser.role, storeId);

    const { name, logoUrl, templateConfig } = dto;

    const [updatedStore] = await this.db
      .update(schema.stores)
      .set({
        ...(name && { name }),
        ...(logoUrl !== undefined && { logoUrl }),
        ...(templateConfig && { templateConfig }),
        updatedAt: new Date(),
      })
      .where(eq(schema.stores.id, storeId))
      .returning();

    return {
      message: 'Store settings updated successfully!',
      store: updatedStore,
    };
  }
}