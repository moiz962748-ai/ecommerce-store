import { Controller, Get, Param, NotFoundException } from '@nestjs/common';
import { StoresService } from './stores.service';

@Controller('public/stores')
export class PublicStoresController {
  constructor(private readonly storesService: StoresService) {}

  @Get(':subdomain')
  async getStoreBySubdomain(@Param('subdomain') subdomain: string) {
    const store = await this.storesService.getStoreBySubdomain(subdomain);
    if (!store) {
      throw new NotFoundException('Store not found');
    }
    return store;
  }
}