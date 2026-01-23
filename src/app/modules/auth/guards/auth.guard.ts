import { CanActivate, ExecutionContext, Injectable, UnauthorizedException } from '@nestjs/common';
import { AuthService } from '../auth.service';

@Injectable()
export class AuthGuard implements CanActivate {
  constructor(private readonly authService: AuthService) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();
    const authHeader = request.headers.authorization;

    if (!authHeader) {
      throw new UnauthorizedException({
        error: {
          code: 'MISSING_AUTHORIZATION_HEADER',
          message: 'Authorization header is required'
        }
      });
    }

    // Extract Bearer token
    const parts = authHeader.split(' ');
    if (parts.length !== 2 || parts[0] !== 'Bearer') {
      throw new UnauthorizedException({
        error: {
          code: 'INVALID_AUTHORIZATION_FORMAT',
          message: 'Authorization header must be in format: Bearer <token>'
        }
      });
    }

    const token = parts[1];

    // Validate token
    const isValid = await this.authService.validateToken(token);

    if (!isValid) {
      throw new UnauthorizedException({
        error: {
          code: 'INVALID_TOKEN',
          message: 'Invalid or expired token'
        }
      });
    }

    return true;
  }
}
