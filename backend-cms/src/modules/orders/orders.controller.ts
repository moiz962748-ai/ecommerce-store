import { Controller, Post, Get, Patch, Body, Param, UseGuards, Req } from '@nestjs/common';
import { OrdersService } from './orders.service';
import { AuthGuard } from '@nestjs/passport';
import { RolesGuard } from '../auth/roles.guard';
import { Roles } from '../auth/roles.decorator';

@Controller('orders')
@UseGuards(AuthGuard('jwt'), RolesGuard)
export class OrdersController {
  constructor(private readonly ordersService: OrdersService) {}

  @Post()
  @Roles('ADMIN', 'PARTNER', 'CUSTOMER')
  async createOrder(@Body() body: any, @Req() req: any) {
    const userId = req.user?.userId || req.user?.id || req.user?.sub;
    return await this.ordersService.createOrder(body, userId);
  }

  @Get('store/:storeId')
  @Roles('ADMIN', 'PARTNER')
  async getOrdersByStore(@Param('storeId') storeId: string) {
    return await this.ordersService.getOrdersByStore(storeId);
  }

  @Patch(':id/status')
async updateOrderStatus(
  @Param('id') id: string,
  @Body('status') status: 'PENDING' | 'CONFIRMED' | 'SHIPPED' | 'DELIVERED' | 'CANCELLED',
) {
  return await this.ordersService.updateOrderStatus(id, status);
}
}