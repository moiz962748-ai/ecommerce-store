import { Injectable, Inject, BadRequestException } from '@nestjs/common';
import { DRIZZLE } from '../../db/drizzle.provider';
import { PostgresJsDatabase } from 'drizzle-orm/postgres-js';
import * as schema from '../../db/schema';
import { orders } from '../../db/schema';
import { CreateOrderDto } from './dto/create-order.dto';
import { eq, desc } from 'drizzle-orm';

@Injectable()
export class OrdersService {
  constructor(
    @Inject(DRIZZLE)
    private db: PostgresJsDatabase<typeof schema>,
  ) {}

  async createOrder(dto: CreateOrderDto, authenticatedUserId?: string) {
    const { storeId, price, address, userId } = dto;

    const finalUserId = userId || authenticatedUserId;

    if (!finalUserId) {
      throw new BadRequestException('userId is required to create an order!');
    }

    const [newOrder] = await this.db
      .insert(orders)
      .values({
        storeId,
        userId: finalUserId,
        price: String(price),
        address,
        orderStatus: 'PENDING',
      })
      .returning();

    return {
      message: 'Order placed successfully!',
      order: newOrder,
    };
  }

  async getOrdersByStore(storeId: string) {
    return await this.db.select().from(orders).where(eq(orders.storeId, storeId));
  }

  async getOrdersByUser(userId: string) {
    return await this.db
      .select()
      .from(orders)
      .where(eq(orders.userId, userId))
      .orderBy(desc(orders.createdAt));
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
      message: 'Order status updated successfully!',
      order: updatedOrder,
    };
  }
}