import { Injectable, Inject } from '@nestjs/common';
import { DRIZZLE } from '../../db/drizzle.provider';
import { PostgresJsDatabase } from 'drizzle-orm/postgres-js';
import * as schema from '../../db/schema';

@Injectable()
export class CategoriesService {
  constructor(
    @Inject(DRIZZLE)
    private db: PostgresJsDatabase<typeof schema>,
  ) {}

  async createCategory(body: any) {
    const { name } = body;

    const [newCategory] = await this.db
      .insert(schema.category)
      .values({
        name,
      })
      .returning();

    return {
      message: 'Category successfully create ho gayi hai!',
      category: newCategory,
    };
  }

  async getAllCategories() {
    return await this.db.query.category.findMany();
  }
}