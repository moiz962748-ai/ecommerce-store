import { Injectable, Inject, ForbiddenException } from '@nestjs/common';
import { DRIZZLE } from '../db/drizzle.provider';
import { PostgresJsDatabase } from 'drizzle-orm/postgres-js';
import * as schema from '../db/schema';
import { and, eq } from 'drizzle-orm';

@Injectable()
export class StoreAccessService {
  constructor(
    @Inject(DRIZZLE)
    private db: PostgresJsDatabase<typeof schema>,
  ) {}

  async assertStoreAccess(userId: string, role: string, storeId: string): Promise<void> {
    if (role === 'ADMIN') {
      return;
    }

    const assignment = await this.db.query.storePartner.findFirst({
      where: and(
        eq(schema.storePartner.storeId, storeId),
        eq(schema.storePartner.userId, userId),
      ),
    });

    if (!assignment) {
      throw new ForbiddenException('You are not authorized to manage this store!');
    }
  }
}