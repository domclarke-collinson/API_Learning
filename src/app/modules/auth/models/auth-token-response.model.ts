import { ApiProperty } from '@nestjs/swagger';

export class AuthTokenResponse {
  @ApiProperty({
    description: 'Access token',
    example: 'eyJhbGciOiJSUzI1NiIsInR5cCI6IkpXVCJ9...',
    required: true
  })
  access_token: string;

  @ApiProperty({
    description: 'Token type',
    example: 'Bearer',
    required: true
  })
  token_type: string;

  @ApiProperty({
    description: 'Token expiration time in seconds',
    example: 3600,
    required: true
  })
  expires_in: number;
}
