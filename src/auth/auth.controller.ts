import { Body, Controller, HttpCode, HttpException, HttpStatus, Logger, Post, Req } from '@nestjs/common';
import { ApiBody, ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { Request } from 'express';
import { AuthService } from './auth.service';
import { AuthTokenRequest } from './models/auth-token-request';
import { AuthTokenResponse } from './models/auth-token-response';

@ApiTags('authentication')
@Controller({
  path: 'oauth2',
  version: '1'
})

@Controller('auth')
@ApiTags('auth')
export class AuthController {
    constructor(private readonly authService: AuthService) {}

    @Post('token')
    @HttpCode(HttpStatus.OK)
    @ApiOperation({ summary: 'Get auth token' })
    @ApiResponse({ status: HttpStatus.OK, type: AuthTokenResponse })
    async getAuthToken(@Body() authTokenRequest: AuthTokenRequest): Promise<AuthTokenResponse> {
        return this.authService.getAuthToken(authTokenRequest);
    }


}