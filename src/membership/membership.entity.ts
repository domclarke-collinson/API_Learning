import { Entity, Column, PrimaryGeneratedColumn, CreateDateColumn, ManyToOne, JoinColumn } from 'typeorm';
import { IsEnum, IsEmail, IsString, Length, IsInt, Min } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { Deal } from '../deals/deal.entity';
import { MembershipStatus } from './membership-enums';

@Entity('memberships')
export class Membership {
  @PrimaryGeneratedColumn()
  @ApiProperty({ description: 'Membership ID' })
  id: number;

  @Column({ type: 'varchar', length: 100 })
  @IsString()
  @Length(1, 100)
  @ApiProperty({ description: 'Member name', minLength: 1, maxLength: 100 })
  name: string;

  @Column({ type: 'varchar', length: 255, unique: true })
  @IsEmail()
  @Length(1, 255)
  @ApiProperty({ description: 'Member email address', format: 'email' })
  email: string;

  @Column({ type: 'integer', name: 'deal_id' })
  @IsInt()
  @Min(1)
  @ApiProperty({ description: 'Associated deal ID', minimum: 1 })
  dealId: number;

  @ManyToOne(() => Deal)
  @JoinColumn({ name: 'deal_id' })
  deal?: Deal;

  @Column({
    type: 'enum',
    enum: MembershipStatus,
    default: MembershipStatus.ACTIVE,
  })
  @IsEnum(MembershipStatus)
  @ApiProperty({ 
    description: 'Membership status', 
    enum: MembershipStatus,
    default: MembershipStatus.ACTIVE 
  })
  status: MembershipStatus;

  @CreateDateColumn({ type: 'timestamptz', name: 'created_at' })
  @ApiProperty({ description: 'Creation timestamp' })
  createdAt: Date;
}