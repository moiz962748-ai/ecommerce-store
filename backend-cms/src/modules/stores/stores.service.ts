import { Injectable, Inject, ConflictException } from '@nestjs/common';
import { DRIZZLE } from '../../db/drizzle.provider';
import { PostgresJsDatabase } from 'drizzle-orm/postgres-js';
import * as schema from '../../db/schema';
import { eq } from 'drizzle-orm';
import { StoreAccessService } from '../../common/store-access.service';

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
      throw new Error('Default template create nahi ho saka');
    }

    return created;
  }

  async createStore(body: any) {
    const { name, slug, subDomain, templateId, logoUrl, templateConfig } = body;

    const finalSubDomain = subDomain || slug;

    const existingStore = await this.db.query.stores.findFirst({
      where: eq(schema.stores.subDomain, finalSubDomain),
    });

    if (existingStore) {
      throw new ConflictException('Is subDomain/slug ke sath store pehle se majood hai!');
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
      message: 'Store successfully create ho gaya hai!',
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
      message: 'Partner successfully store se assign ho gaya hai!',
      assignment,
    };
  }

  async updateStore(storeId: string, body: any, currentUser: { userId: string; role: string }) {
    await this.storeAccessService.assertStoreAccess(currentUser.userId, currentUser.role, storeId);

    const { name, logoUrl, templateConfig } = body;

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
      message: 'Store settings successfully update ho gayi hain!',
      store: updatedStore,
    };
  }
}