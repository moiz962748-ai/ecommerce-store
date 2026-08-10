import { Controller, Post, Get, Patch, Body, Param, UseGuards, Req } from '@nestjs/common';
import { StoresService } from './stores.service';
import { AuthGuard } from '@nestjs/passport';
import { RolesGuard } from '../auth/roles.guard';
import { Roles } from '../auth/roles.decorator';
import { CreateStoreDto } from './dto/create-store.dto';
import { UpdateStoreDto } from './dto/update-store.dto';

@Controller('stores')
@UseGuards(AuthGuard('jwt'), RolesGuard)
export class StoresController {
  constructor(private readonly storesService: StoresService) {}

  @Post()
  @Roles('ADMIN')
  async createStore(@Body() dto: CreateStoreDto) {
    return await this.storesService.createStore(dto);
  }

  @Get()
  @Roles('ADMIN', 'PARTNER', 'CUSTOMER')
  async getAllStores() {
    return await this.storesService.getAllStores();
  }

  @Post('assign-partner')
  @Roles('ADMIN')
  async assignPartner(@Body() body: any) {
    return await this.storesService.assignPartnerToStore(body);
  }

  @Patch(':id')
  @Roles('ADMIN', 'PARTNER')
  async updateStore(@Param('id') id: string, @Body() dto: UpdateStoreDto, @Req() req: any) {
    return await this.storesService.updateStore(id, dto, req.user);
  }
}