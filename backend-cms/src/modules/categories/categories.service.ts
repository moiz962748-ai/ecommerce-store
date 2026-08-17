import { Injectable, Inject, NotFoundException } from '@nestjs/common';
import { DRIZZLE } from '../../db/drizzle.provider';
import { PostgresJsDatabase } from 'drizzle-orm/postgres-js';
import * as schema from '../../db/schema';
import { eq } from 'drizzle-orm';

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

  async updateCategory(id: string, body: any) {
    const { name } = body;

    const [updatedCategory] = await this.db
      .update(schema.category)
      .set({
        name,
      })
      .where(eq(schema.category.id, id))
      .returning();

    if (!updatedCategory) {
      throw new NotFoundException(`Category with ID ${id} not found`);
    }

    return {
      message: 'Category successfully update ho gayi hai!',
      category: updatedCategory,
    };
  }

  async deleteCategory(id: string) {
  return await this.db.transaction(async (tx) => {
    // 1. Delete associated products first
    await tx
      .delete(schema.products)
      .where(eq(schema.products.categoryId, id));

    // 2. Delete the category
    const [deletedCategory] = await tx
      .delete(schema.category)
      .where(eq(schema.category.id, id))
      .returning();

    if (!deletedCategory) {
      throw new NotFoundException(`Category with ID ${id} not found`);
    }

    return {
      message: 'Category and associated products deleted successfully!',
      category: deletedCategory,
    };
  });
}
}