import {
  Controller,
  Get,
  Post,
  Put,
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
import { UpdateStoreConfigDto } from './dto/update-store-config.dto';

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

  // CMS Customizer Config Update Route (Subdomain based)
  @Put('customizer/:subdomain')
  @Roles('ADMIN', 'PARTNER')
  async updateStoreConfig(
    @Param('subdomain') subdomain: string,
    @Body() dto: UpdateStoreConfigDto,
  ) {
    return await this.storesService.updateStoreConfig(subdomain, dto);
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