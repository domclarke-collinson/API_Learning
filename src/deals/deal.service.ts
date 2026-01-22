import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { DealStatus } from './deal-enums';
import { Deal } from './deal.entity';
import { UpdateDealModel } from './models/update-deal.model';

@Injectable()
export class DealService {
  constructor(
    @InjectRepository(Deal)
    private readonly dealRepository: Repository<Deal>
  ) {}

  async findAll(): Promise<Deal[]> {
    return this.dealRepository.find({
      relations: ['memberships']
    });
  }

  async findOne(dealId: number): Promise<Deal | null> {
    return this.dealRepository.findOne({
      where: { dealId },
      relations: ['memberships']
    });
  }

  async findByClientId(clientId: string): Promise<Deal[]> {
    return this.dealRepository.find({
      where: { clientId },
      relations: ['memberships']
    });
  }

  async findByStatus(status: DealStatus): Promise<Deal[]> {
    return this.dealRepository.find({
      where: { status },
      relations: ['memberships']
    });
  }

  async create(dealData: { clientId: string; status?: DealStatus }): Promise<Deal> {
    const deal = this.dealRepository.create({
      clientId: dealData.clientId,
      status: dealData.status || DealStatus.Draft
    });
    return this.dealRepository.save(deal);
  }

  async update(dealId: number, updateData: UpdateDealModel): Promise<Deal> {
    const deal = await this.findOne(dealId);

    if (!deal) {
      throw new NotFoundException(`Deal with ID ${dealId} not found`);
    }

    deal.status = updateData.status;
    return this.dealRepository.save(deal);
  }
}
