import { Global, Module } from '@nestjs/common';
import { StoreAccessService } from './store-access.service';

@Global()
@Module({
  providers: [StoreAccessService],
  exports: [StoreAccessService],
})
export class CommonModule {}