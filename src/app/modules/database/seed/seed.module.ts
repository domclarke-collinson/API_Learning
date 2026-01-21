import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Deal } from 'src/deals/deal.entity';
import { Membership } from 'src/membership/membership.entity';
import { SeedService } from './seed.service';

@Module({
  imports: [TypeOrmModule.forFeature([Deal, Membership])],
  providers: [SeedService],
  exports: [SeedService],
})
export class SeedModule {}