import { Module } from '@nestjs/common';
import { ItemsService, PropertiesValidatorService } from './items.service';
import { ItemsController } from './items.controller';

@Module({
  controllers: [ItemsController],
  providers: [ItemsService, PropertiesValidatorService],
})
export class ItemsModule {}
