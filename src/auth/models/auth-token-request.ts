import { ApiProperty } from '@nestjs/swagger';
import { IsEnum, IsNotEmpty, IsOptional, IsString, Length } from 'class-validator';

export enum AuthGrantType {
  ClientCredentials = 'client_credentials',
  Password = 'password',
  RefreshToken = 'refresh_token'
}

export class AuthTokenRequest {
  @ApiProperty({
    description: 'The client identifier',
    example: 'your-client-id',
    minLength: 1,
    maxLength: 255,
    required: true
  })
  @IsString()
  @Length(1, 255)
  @IsNotEmpty()
  client_id: string;

  @ApiProperty({
    description: 'The client secret',
    example: 'your-client-secret',
    minLength: 1,
    maxLength: 255,
    required: true
  })
  @IsString()
  @Length(1, 255)
  @IsNotEmpty()
  client_secret: string;

  @ApiProperty({
    description: 'The scope of the token',
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
    description: 'Refresh token for refresh token grant type',
    example: 'refresh-token-string',
    required: false
  })
  @IsString()
  @IsOptional()
  refresh_token?: string;
}
