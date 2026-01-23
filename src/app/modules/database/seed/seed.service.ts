import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { DealStatus } from 'src/deals/deal-enums';
import { Deal } from 'src/deals/deal.entity';
import { MembershipStatus } from 'src/membership/membership-enums';
import { Membership } from 'src/membership/membership.entity';
import { Repository } from 'typeorm';

@Injectable()
export class SeedService {
  constructor(
    @InjectRepository(Deal)
    private readonly dealRepository: Repository<Deal>,
    @InjectRepository(Membership)
    private readonly membershipRepository: Repository<Membership>
  ) {}

  async seed(): Promise<void> {
    // Check if data already exists
    const existingDeals = await this.dealRepository.count();
    if (existingDeals > 0) {
      console.log('Database already seeded. Skipping...');
      return;
    }

    // Create deals
    const deal1 = this.dealRepository.create({
      clientId: 'JusticeLeague',
      status: DealStatus.Active
    });

    const deal2 = this.dealRepository.create({
      clientId: 'YoungJustice',
      status: DealStatus.Draft
    });

    const deal3 = this.dealRepository.create({
      clientId: 'JusticeSociety',
      status: DealStatus.Inactive
    });

    const savedDeals = await this.dealRepository.save([deal1, deal2, deal3]);
    console.log(`Created ${savedDeals.length} deals`);

    // Create memberships
    const membership1 = this.membershipRepository.create({
      name: 'Clark Kent',
      email: 'clark.kent@example.com',
      dealId: savedDeals[0].dealId,
      status: MembershipStatus.Active
    });

    const membership2 = this.membershipRepository.create({
      name: 'Bruce Wayne',
      email: 'bruce.wayne@example.com',
      dealId: savedDeals[0].dealId,
      status: MembershipStatus.Inactive
    });

    const membership3 = this.membershipRepository.create({
      name: 'Diana Prince',
      email: 'diana.prince@example.com',
      dealId: savedDeals[0].dealId,
      status: MembershipStatus.Cancelled
    });

    const savedMemberships = await this.membershipRepository.save([membership1, membership2, membership3]);
    console.log(`Created ${savedMemberships.length} memberships`);
    console.log('Database seeded successfully!');
  }
}
