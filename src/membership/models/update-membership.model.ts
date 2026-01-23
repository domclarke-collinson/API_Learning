import { ApiProperty } from '@nestjs/swagger';
import { Transform } from 'class-transformer';
import { IsEnum } from 'class-validator';
import { MembershipStatus } from '../membership-enums';

export class UpdateMembershipModel {
  @ApiProperty({
    description: 'Membership status (case-insensitive)',
    enum: MembershipStatus,
    example: MembershipStatus.Active,
    required: true
  })
  @Transform(({ value }) => {
    if (typeof value === 'string') {
      const lowerValue = value.toLowerCase();
      // Check if the lowercase value matches any enum value
      if (Object.values(MembershipStatus).includes(lowerValue as MembershipStatus)) {
        return lowerValue as MembershipStatus;
      }
    }
    return value;
  })
  @IsEnum(MembershipStatus)
  status: MembershipStatus;
}
