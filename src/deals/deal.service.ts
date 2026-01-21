import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Deal } from './deal.entity';
import { DealStatus } from './deal-enums';

@Injectable()
export class DealService {
  constructor(
    @InjectRepository(Deal)
    private readonly dealRepository: Repository<Deal>,
  ) {}

  async findAll(): Promise<Deal[]> {
    return this.dealRepository.find({
      relations: ['memberships'],
    });
  }

  async findOne(dealId: number): Promise<Deal | null> {
    return this.dealRepository.findOne({
      where: { dealId },
      relations: ['memberships'],
    });
  }

  async findByClientId(clientId: number): Promise<Deal[]> {
    return this.dealRepository.find({
      where: { clientId },
      relations: ['memberships'],
    });
  }

  async findByStatus(status: DealStatus): Promise<Deal[]> {
    return this.dealRepository.find({
      where: { status },
      relations: ['memberships'],
    });
  }
}