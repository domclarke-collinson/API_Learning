import { HttpService } from '@nestjs/axios';
import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import * as jwt from 'jsonwebtoken';
import { firstValueFrom } from 'rxjs';
import { AppConfigService } from '../../config/config.service';
import { AuthTokenRequest, AuthTokenResponse } from './models';

@Injectable()
export class AuthService {
  constructor(
    private readonly httpService: HttpService,
    private readonly configService: AppConfigService
  ) {}

  async getToken(body: AuthTokenRequest): Promise<AuthTokenResponse> {
    try {
      // Realm is required
      if (!body.realm) {
        throw new HttpException(
          {
            error: {
              code: 'REALM_REQUIRED',
              message: 'Realm is required for token issuance. Provide realm parameter in request body.'
            }
          },
          HttpStatus.BAD_REQUEST
        );
      }

      const keycloakConfig = this.configService.keycloakConfig;
      const realm = body.realm;
      const tokenEndpoint = `${keycloakConfig.baseUrl}/realms/${realm}/protocol/openid-connect/token`;

      const params: Record<string, string> = {
        grant_type: 'client_credentials', // Always use client_credentials for Keycloak
        client_id: body.client_id,
        client_secret: body.client_secret,
        scope: body.scope || 'all'
      };

      const response = await firstValueFrom(
        this.httpService.post(tokenEndpoint, new URLSearchParams(params), {
          headers: {
            'Content-Type': 'application/x-www-form-urlencoded'
          },
          timeout: keycloakConfig.timeout
        })
      );

      // Extract only the fields we want to return
      const keycloakResponse = response.data;
      const tokenResponse: AuthTokenResponse = {
        access_token: keycloakResponse.access_token,
        token_type: keycloakResponse.token_type,
        expires_in: keycloakResponse.expires_in
      };

      return tokenResponse;
    } catch (error) {
      // If it's already an HttpException (validation errors), re-throw it
      if (error instanceof HttpException) {
        throw error;
      }

      const errorStatus = error.response?.status;

      if (errorStatus === 400) {
        const keycloakError = error.response?.data?.error_description || error.response?.data?.error || 'Bad request';
        throw new HttpException(
          {
            error: {
              code: 'BAD_REQUEST',
              message: `Invalid OAuth2 token request: ${keycloakError}`
            }
          },
          HttpStatus.BAD_REQUEST
        );
      }

      if (errorStatus === 401) {
        throw new HttpException(
          {
            error: {
              code: 'CLIENT_CREDENTIALS_INVALID',
              message: 'Invalid client credentials for OAuth2 token request'
            }
          },
          HttpStatus.UNAUTHORIZED
        );
      }

      if (errorStatus === 403) {
        throw new HttpException(
          {
            error: {
              code: 'SCOPE_AUTHORIZATION_INSUFFICIENT',
              message: 'Insufficient scope authorization for OAuth2 token request'
            }
          },
          HttpStatus.FORBIDDEN
        );
      }

      if (errorStatus === 429) {
        throw new HttpException(
          {
            error: {
              code: 'RATE_LIMIT_EXCEEDED',
              message: 'Rate limit exceeded for OAuth2 token requests'
            }
          },
          HttpStatus.TOO_MANY_REQUESTS
        );
      }

      throw new HttpException(
        {
          error: {
            code: 'INTERNAL_ERROR',
            message: 'An unexpected error occurred while processing OAuth2 token request'
          }
        },
        HttpStatus.INTERNAL_SERVER_ERROR
      );
    }
  }

  async validateToken(token: string): Promise<boolean> {
    try {
      if (!token) {
        return false;
      }

      // Decode the JWT token (without verification for lightweight approach)
      const decoded = jwt.decode(token, { complete: true });

      if (!decoded || typeof decoded === 'string' || !decoded.payload) {
        return false;
      }

      const payload = decoded.payload as { exp?: number; iat?: number };

      // Check if token has expiration
      if (!payload.exp) {
        return false;
      }

      // Check if token is expired
      const now = Math.floor(Date.now() / 1000);
      if (payload.exp < now) {
        return false;
      }

      return true;
    } catch (error) {
      console.error('Token validation error:', error);
      return false;
    }
  }
}
