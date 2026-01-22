import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsString, Length } from 'class-validator';

export class CreateMembershipModel {
  @ApiProperty({
    description: 'Member email address',
    example: 'user@example.com',
    format: 'email'
  })
  @IsEmail()
  @IsString()
  email: string;

  @ApiProperty({
    description: 'Member name',
    example: 'John Doe',
    minLength: 1,
    maxLength: 100
  })
  @IsString()
  @Length(1, 100)
  name: string;
}
