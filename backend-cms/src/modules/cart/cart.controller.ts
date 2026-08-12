import { Controller, Post, Get, Delete, Body, Param, UseGuards, Req } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { CartService } from './cart.service';
import { AddToCartDto } from './dto/add-to-cart.dto';

@Controller('cart')
@UseGuards(AuthGuard('jwt'))
export class CartController {
  constructor(private readonly cartService: CartService) {}

  @Post()
  async addToCart(@Body() dto: AddToCartDto, @Req() req: any) {
    return await this.cartService.addToCart(req.user.userId, dto.productId, dto.quantity);
  }

  @Get()
  async getCart(@Req() req: any) {
    return await this.cartService.getCart(req.user.userId);
  }

  @Delete(':id')
  async removeFromCart(@Param('id') id: string, @Req() req: any) {
    return await this.cartService.removeFromCart(id, req.user.userId);
  }
}