import { Injectable, Inject, BadRequestException } from '@nestjs/common';
import { DRIZZLE } from '../../db/drizzle.provider';
import { PostgresJsDatabase } from 'drizzle-orm/postgres-js';
import * as schema from '../../db/schema';
import { eq } from 'drizzle-orm';

@Injectable()
export class OrdersService {
  constructor(
    @Inject(DRIZZLE)
    private db: PostgresJsDatabase<typeof schema>,
  ) {}

  async createOrder(body: any, authenticatedUserId?: string) {
    const { storeId, totalAmount, price, address, status, userId } = body;

    const finalUserId = userId || authenticatedUserId;

    if (!finalUserId) {
      throw new BadRequestException('Order create karne ke liye userId zaroori hai!');
    }

    const orderTable = (schema as any).orders || (schema as any).order;
    const finalPrice = price || totalAmount || '0';

    const [newOrder] = await this.db
      .insert(orderTable)
      .values({
        storeId: storeId || null,
        userId: finalUserId,
        price: String(finalPrice),
        totalAmount: String(finalPrice),
        address: address || 'Main Street, City', // Fallback address agar body me missing ho
        status: status || 'PENDING',
      })
      .returning();

    return {
      message: 'Order successfully place ho gaya hai!',
      order: newOrder,
    };
  }

  async getOrdersByStore(storeId: string) {
    const orderTable = (schema as any).orders || (schema as any).order;
    return await this.db.select().from(orderTable).where(eq(orderTable.storeId, storeId));
  }
  async updateOrderStatus(orderId: string, status: string) {
  const orderTable = (schema as any).orders || (schema as any).order;

  const [updatedOrder] = await this.db
    .update(orderTable)
    .set({ status })
    .where(eq(orderTable.id, orderId))
    .returning();

  return {
    message: 'Order status successfully update ho gaya hai!',
    order: updatedOrder,
  };
}
}