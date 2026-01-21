import { Deal } from '../deal.entity';
import { DealStatus } from '../deal-enums';

export class DealResponseModel {
  dealId: number;
  clientId: number;
  status: DealStatus;
  createdAt: Date;

  constructor(
    dealId: number,
    clientId: number,
    status: DealStatus,
    createdAt: Date,
  ) {
    this.dealId = dealId;
    this.clientId = clientId;
    this.status = status;
    this.createdAt = createdAt;
  }

  toJSON() {
    return {
      deal_id: this.dealId,
      client_id: this.clientId,
      status: this.status,
      created_at: this.createdAt,
    };
  }

  static fromEntity(entity: Deal): DealResponseModel {
    return new DealResponseModel(
      entity.dealId,
      entity.clientId,
      entity.status,
      entity.createdAt,
    );
  }

  static fromEntities(entities: Deal[]): DealResponseModel[] {
    return entities.map((entity) => DealResponseModel.fromEntity(entity));
  }
}