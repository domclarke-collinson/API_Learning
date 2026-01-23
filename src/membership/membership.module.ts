import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuthServiceModule } from '../app/modules/auth/auth.module';
import { MembershipController } from './membership.controller';
import { Membership } from './membership.entity';
import { MembershipService } from './membership.service';

@Module({
  imports: [TypeOrmModule.forFeature([Membership]), AuthServiceModule.forRoot()],
  controllers: [MembershipController],
  providers: [MembershipService],
  exports: [MembershipService]
})
export class MembershipModule {}
