import { IsEnum } from 'class-validator';

export enum OrderStatusEnum {
  PENDING = 'PENDING',
  CONFIRMED = 'CONFIRMED',
  SHIPPED = 'SHIPPED',
  DELIVERED = 'DELIVERED',
  CANCELLED = 'CANCELLED',
}

export class UpdateOrderStatusDto {
  @IsEnum(OrderStatusEnum, { message: 'status in values mein se ek hona chahiye: PENDING, CONFIRMED, SHIPPED, DELIVERED, CANCELLED' })
  status!: OrderStatusEnum;
}