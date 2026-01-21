import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Membership } from './membership.entity';

@Injectable()
export class MembershipService {
  constructor(
    @InjectRepository(Membership)
    private readonly membershipRepository: Repository<Membership>,
  ) {}

  async findAll(): Promise<Membership[]> {
    return this.membershipRepository.find();
  }

  async findOne(id: number): Promise<Membership | null> {
    return this.membershipRepository.findOne({ where: { id } });
  }

  async findByEmail(email: string): Promise<Membership | null> {
    return this.membershipRepository.findOne({ where: { email } });
  }

  async create(membershipData: { name: string; email: string }): Promise<Membership> {
    const membership = this.membershipRepository.create(membershipData);
    return this.membershipRepository.save(membership);
  }
}