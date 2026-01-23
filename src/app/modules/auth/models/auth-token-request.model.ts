import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsOptional, IsString, Length } from 'class-validator';

export class AuthTokenRequest {
  @ApiProperty({
    description: 'Id of the user',
    example: 'user-master',
    minLength: 1,
    maxLength: 255,
    required: true
  })
  @IsString()
  @Length(1, 255)
  @IsNotEmpty()
  client_id: string;

  @ApiProperty({
    description: 'Secret of the user',
    example: 'secret',
    minLength: 1,
    maxLength: 255,
    required: true
  })
  @IsString()
  @Length(1, 255)
  @IsNotEmpty()
  client_secret: string;

  @ApiProperty({
    description: 'Scope',
    example: 'all',
    minLength: 1,
    maxLength: 1000,
    required: false
  })
  @IsString()
  @Length(1, 1000)
  @IsOptional()
  scope?: string;

  @ApiProperty({
    description: 'Realm name',
    example: 'realm-master',
    minLength: 1,
    maxLength: 255,
    required: true
  })
  @IsString()
  @Length(1, 255)
  @IsNotEmpty()
  realm: string;
}
