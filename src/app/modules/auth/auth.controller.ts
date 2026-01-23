import { Body, Controller, HttpCode, HttpStatus, Logger, Post } from '@nestjs/common';
import { ApiBody, ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { AuthService } from './auth.service';
import { AuthTokenRequest, AuthTokenResponse } from './models';

@ApiTags('authentication')
@Controller({
  path: 'oauth2'
})
export class AuthController {
  private readonly logger = new Logger(AuthController.name);

  constructor(private readonly authService: AuthService) {}

  @Post('/token')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({
    summary: 'Get OAuth2 access token',
    description: 'Issues an OAuth2 access token using client credentials flow with Keycloak.'
  })
  @ApiBody({ type: AuthTokenRequest })
  @ApiResponse({
    status: 200,
    description: 'Token successfully generated',
    type: AuthTokenResponse
  })
  @ApiResponse({
    status: 401,
    description: 'Invalid client credentials'
  })
  @ApiResponse({
    status: 400,
    description: 'Invalid request parameters'
  })
  async getToken(@Body() body: AuthTokenRequest): Promise<AuthTokenResponse> {
    this.logger.log(`Token request received for client '${body.client_id}'`);

    try {
      const result = await this.authService.getToken(body);
      this.logger.log(`Token request completed successfully for client '${body.client_id}'`);
      return result;
    } catch (error) {
      this.logger.error(`Token request failed for client '${body.client_id}': ${error.message}`);
      throw error;
    }
  }
}
