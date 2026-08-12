import { Module } from '@nestjs/common';
import { StoresController } from './stores.controller';
import { StoresService } from './stores.service';
import { PublicStoresController } from './public-stores.controller';

@Module({
  controllers: [StoresController, PublicStoresController],
  providers: [StoresService],
})

export class StoresModule {}