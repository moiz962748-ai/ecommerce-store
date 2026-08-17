import {
  Controller,
  Get,
  Post,
  Patch,
  Delete,
  Param,
  Body,
  UseGuards,
  Request,
} from '@nestjs/common';
import { StoresService } from './stores.service';
import { AuthGuard } from '@nestjs/passport';
import { RolesGuard } from '../auth/roles.guard';
import { Roles } from '../auth/roles.decorator';

@Controller('stores')
@UseGuards(AuthGuard('jwt'), RolesGuard)
export class StoresController {
  constructor(private readonly storesService: StoresService) {}

  @Post()
  @Roles('ADMIN', 'PARTNER')
  async createStore(@Body() body: any) {
    return await this.storesService.createStore(body);
  }

  @Post('assign-partner')
  @Roles('ADMIN')
  async assignPartner(@Body() body: { storeId: string; userId: string }) {
    return await this.storesService.assignPartner(body);
  }

  // Add this endpoint above @Get(':id')
  @Get('my-stores')
  @Roles('ADMIN', 'PARTNER')
  async getMyStores(@Request() req: any) {
    const userId = req.user.id || req.user.userId || req.user.sub;
    return await this.storesService.getStoresByPartner(userId);
  }

  @Get()
  @Roles('ADMIN', 'PARTNER')
  async getAllStores() {
    return await this.storesService.getAllStores();
  }

  @Get(':id')
  @Roles('ADMIN', 'PARTNER')
  async getStoreById(@Param('id') id: string) {
    return await this.storesService.getStoreById(id);
  }

  @Patch(':id')
  @Roles('ADMIN', 'PARTNER')
  async updateStore(@Param('id') id: string, @Body() body: any) {
    return await this.storesService.updateStore(id, body);
  }

  @Delete(':id')
  @Roles('ADMIN')
  async deleteStore(@Param('id') id: string) {
    return await this.storesService.deleteStore(id);
  }
}