import { ApiProperty } from '@nestjs/swagger';
import { IsEnum, IsString, Length, Matches } from 'class-validator';
import { Column, CreateDateColumn, Entity, OneToMany, PrimaryGeneratedColumn } from 'typeorm';
import { Membership } from '../membership/membership.entity';
import { DealStatus } from './deal-enums';

@Entity('deals')
export class Deal {
  @PrimaryGeneratedColumn({ name: 'deal_id' })
  @ApiProperty({ description: 'Deal ID' })
  dealId: number;

  @Column({ type: 'varchar', length: 64, name: 'client_id' })
  @IsString()
  @Length(1, 64)
  @Matches(/^[a-zA-Z0-9]+$/, {
    message: 'client_id must contain only alphanumeric characters (a-z, A-Z, 0-9)'
  })
  @ApiProperty({
    description: 'Client ID (alphanumeric, 1-64 characters)',
    example: 'CLIENT001',
    minLength: 1,
    maxLength: 64
  })
  clientId: string;

  @Column({
    type: 'enum',
    enum: DealStatus,
    default: DealStatus.Draft
  })
  @IsEnum(DealStatus)
  @ApiProperty({
    description: 'Deal status',
    enum: DealStatus,
    default: DealStatus.Draft
  })
  status: DealStatus;

  @CreateDateColumn({ type: 'timestamptz', name: 'created_at' })
  @ApiProperty({ description: 'Creation timestamp' })
  createdAt: Date;

  @OneToMany(() => Membership, (membership) => membership.deal)
  memberships?: Membership[];
}
