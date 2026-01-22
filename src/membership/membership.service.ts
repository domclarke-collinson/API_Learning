import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Membership } from './membership.entity';
import { UpdateMembershipModel } from './models/update-membership.model';

@Injectable()
export class MembershipService {
  constructor(
    @InjectRepository(Membership)
    private readonly membershipRepository: Repository<Membership>
  ) {}

  async findAll(): Promise<Membership[]> {
    return this.membershipRepository.find({
      relations: ['deal']
    });
  }

  async findOne(id: number): Promise<Membership | null> {
    return this.membershipRepository.findOne({
      where: { id },
      relations: ['deal']
    });
  }

  async findByEmail(email: string): Promise<Membership | null> {
    return this.membershipRepository.findOne({
      where: { email },
      relations: ['deal']
    });
  }

  async findByDealId(dealId: number): Promise<Membership[]> {
    return this.membershipRepository.find({
      where: { dealId },
      relations: ['deal']
    });
  }

  async create(membershipData: { name: string; email: string; dealId: number }): Promise<Membership> {
    const membership = this.membershipRepository.create(membershipData);
    return this.membershipRepository.save(membership);
  }

  async update(membershipId: number, updateData: UpdateMembershipModel): Promise<Membership> {
    const membership = await this.findOne(membershipId);

    if (!membership) {
      throw new NotFoundException(`Membership with ID ${membershipId} not found`);
    }

    membership.status = updateData.status;
    return this.membershipRepository.save(membership);
  }
}
