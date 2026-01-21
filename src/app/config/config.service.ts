import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class AppConfigService {
  constructor(private configService: ConfigService) {}

  get dbHost(): string {
    return this.configService.get<string>('DB_HOST', 'localhost');
  }

  get dbPort(): number {
    return this.configService.get<number>('DB_PORT', 5438);
  }

  get dbUsername(): string {
    return this.configService.get<string>('DB_USERNAME', 'myuser');
  }

  get dbPassword(): string {
    return this.configService.get<string>('DB_PASSWORD', 'mypassword');
  }

  get dbName(): string {
    return this.configService.get<string>('DB_NAME', 'mydb');
  }

  get nodeEnv(): string {
    return this.configService.get<string>('NODE_ENV', 'development');
  }

  get isDevelopment(): boolean {
    return this.nodeEnv === 'development';
  }
}