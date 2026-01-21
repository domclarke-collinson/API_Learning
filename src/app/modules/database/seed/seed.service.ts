import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Deal } from 'src/deals/deal.entity';
import { DealStatus } from 'src/deals/deal-enums';
import { Membership } from 'src/membership/membership.entity';
import { MembershipStatus } from 'src/membership/membership-enums';

@Injectable()
export class SeedService {
  constructor(
    @InjectRepository(Deal)
    private readonly dealRepository: Repository<Deal>,
    @InjectRepository(Membership)
    private readonly membershipRepository: Repository<Membership>,
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
      clientId: 1,
      status: DealStatus.Active,
    });

    const deal2 = this.dealRepository.create({
      clientId: 2,
      status: DealStatus.Draft,
    });

    const savedDeals = await this.dealRepository.save([deal1, deal2]);
    console.log(`Created ${savedDeals.length} deals`);

    // Create memberships
    const membership1 = this.membershipRepository.create({
      name: 'John Doe',
      email: 'john.doe@example.com',
      dealId: savedDeals[0].dealId,
      status: MembershipStatus.ACTIVE,
    });

    const membership2 = this.membershipRepository.create({
      name: 'Jane Smith',
      email: 'jane.smith@example.com',
      dealId: savedDeals[0].dealId,
      status: MembershipStatus.ACTIVE,
    });

    const membership3 = this.membershipRepository.create({
      name: 'Bob Johnson',
      email: 'bob.johnson@example.com',
      dealId: savedDeals[1].dealId,
      status: MembershipStatus.ACTIVE,
    });

    const savedMemberships = await this.membershipRepository.save([
      membership1,
      membership2,
      membership3,
    ]);
    console.log(`Created ${savedMemberships.length} memberships`);
    console.log('Database seeded successfully!');
  }
}