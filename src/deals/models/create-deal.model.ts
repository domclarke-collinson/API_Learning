import { ApiProperty } from '@nestjs/swagger';
import { IsEnum, IsOptional, IsString, Length, Matches } from 'class-validator';
import { DealStatus } from '../deal-enums';

export class CreateDealModel {
  @ApiProperty({
    description: 'Client ID (alphanumeric, 1-64 characters)',
    example: 'CLIENT001',
    minLength: 1,
    maxLength: 64,
    pattern: '^[a-zA-Z0-9]+$'
  })
  @IsString()
  @Length(1, 64)
  @Matches(/^[a-zA-Z0-9]+$/, {
    message: 'client_id must contain only alphanumeric characters (a-z, A-Z, 0-9)'
  })
  client_id: string;

  @ApiProperty({
    description: 'Deal status',
    enum: DealStatus,
    example: DealStatus.Draft,
    default: DealStatus.Draft,
    required: false
  })
  @IsEnum(DealStatus)
  @IsOptional()
  status?: DealStatus;
}
