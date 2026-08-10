import { Injectable, Inject, BadRequestException } from '@nestjs/common';
import { DRIZZLE } from '../../db/drizzle.provider';
import { PostgresJsDatabase } from 'drizzle-orm/postgres-js';
import * as schema from '../../db/schema';
import { orders } from '../../db/schema';
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

    if (!storeId) {
      throw new BadRequestException('Order create karne ke liye storeId zaroori hai!');
    }

    if (!address) {
      throw new BadRequestException('Order create karne ke liye address zaroori hai!');
    }

    const finalPrice = price || totalAmount || '0';

    const [newOrder] = await this.db
      .insert(orders)
      .values({
        storeId,
        userId: finalUserId,
        price: String(finalPrice),
        address,
        orderStatus: status || 'PENDING',
      })
      .returning();

    return {
      message: 'Order successfully place ho gaya hai!',
      order: newOrder,
    };
  }

  async getOrdersByStore(storeId: string) {
    return await this.db.select().from(orders).where(eq(orders.storeId, storeId));
  }

  async updateOrderStatus(
    orderId: string,
    status: 'PENDING' | 'CONFIRMED' | 'SHIPPED' | 'DELIVERED' | 'CANCELLED',
  ) {
    const [updatedOrder] = await this.db
      .update(orders)
      .set({ orderStatus: status })
      .where(eq(orders.id, orderId))
      .returning();

    return {
      message: 'Order status successfully update ho gaya hai!',
      order: updatedOrder,
    };
  }
}