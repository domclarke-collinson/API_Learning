import { ApiProperty } from '@nestjs/swagger';
import { Transform } from 'class-transformer';
import { IsEnum } from 'class-validator';
import { DealStatus } from '../deal-enums';

export class UpdateDealModel {
  @ApiProperty({
    description: 'Deal status (case-insensitive)',
    enum: DealStatus,
    example: DealStatus.Active,
    required: true
  })
  @Transform(({ value }) => {
    if (typeof value === 'string') {
      const upperValue = value.toUpperCase();
      // Check if the uppercase value matches any enum value
      if (Object.values(DealStatus).includes(upperValue as DealStatus)) {
        return upperValue as DealStatus;
      }
    }
    return value;
  })
  @IsEnum(DealStatus)
  status: DealStatus;
}
