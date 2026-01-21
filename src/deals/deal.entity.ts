import { Entity, Column, PrimaryGeneratedColumn, CreateDateColumn, OneToMany } from 'typeorm';
import { IsEnum, IsInt, Min } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { Membership } from '../membership/membership.entity';
import { DealStatus } from './deal-enums';

@Entity('deals')
export class Deal {
  @PrimaryGeneratedColumn({ name: 'deal_id' })
  @ApiProperty({ description: 'Deal ID' })
  dealId: number;

  @Column({ type: 'integer', name: 'client_id' })
  @IsInt()
  @Min(1)
  @ApiProperty({ description: 'Client ID', minimum: 1 })
  clientId: number;

  @Column({
    type: 'enum',
    enum: DealStatus,
    default: DealStatus.Draft,
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