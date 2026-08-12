import { Controller, Post, Get, Delete, Body, Param, UseGuards, Req } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { WishlistService } from './wishlist.service';
import { AddToWishlistDto } from './dto/add-to-wishlist.dto';

@Controller('wishlist')
@UseGuards(AuthGuard('jwt'))
export class WishlistController {
  constructor(private readonly wishlistService: WishlistService) {}

  @Post()
  async addToWishlist(@Body() dto: AddToWishlistDto, @Req() req: any) {
    return await this.wishlistService.addToWishlist(req.user.userId, dto.productId);
  }

  @Get()
  async getWishlist(@Req() req: any) {
    return await this.wishlistService.getWishlist(req.user.userId);
  }

  @Delete(':id')
  async removeFromWishlist(@Param('id') id: string, @Req() req: any) {
    return await this.wishlistService.removeFromWishlist(id, req.user.userId);
  }
}