import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Deal } from './deal.entity';
import { DealService } from './deal.service';
import { DealController } from './deal.controller';

@Module({
  imports: [TypeOrmModule.forFeature([Deal])],
  controllers: [DealController],
  providers: [DealService],
  exports: [DealService],
})
export class DealModule {}