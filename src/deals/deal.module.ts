import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuthServiceModule } from '../app/modules/auth/auth.module';
import { DealController } from './deal.controller';
import { Deal } from './deal.entity';
import { DealService } from './deal.service';
@Module({
  imports: [TypeOrmModule.forFeature([Deal]), AuthServiceModule.forRoot()],
  controllers: [DealController],
  providers: [DealService],
  exports: [DealService]
})
export class DealModule {}
