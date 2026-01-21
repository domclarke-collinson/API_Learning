import { Module } from "@nestjs/common";
import { MembershipModule } from "src/membership";
import { DealModule } from "src/deals";
import { HealthController } from "./modules/health/health.controller";
import { ConfigModule, ConfigService } from "@nestjs/config";
import { TypeOrmModule } from "@nestjs/typeorm";
import { join } from "path";
import { AppConfigService } from './config/config.service';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: ['.env'],
    }),
    
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: (configService: ConfigService) => {
        const isDevelopment = configService.get<string>('NODE_ENV', 'development') === 'development';
        
        return {
          type: 'postgres',
          host: configService.get<string>('DB_HOST', 'localhost'),
          port: configService.get<number>('DB_PORT', 5438),
          username: configService.get<string>('DB_USERNAME', 'myuser'),
          password: configService.get<string>('DB_PASSWORD', 'mypassword'),
          database: configService.get<string>('DB_NAME', 'mydb'),
          entities: [join(__dirname, '..', '**', '*.entity.{ts,js}')],
          migrations: [join(__dirname, 'modules', 'database', 'migrations', '*.{ts,js}')],
          migrationsRun: false, // Set to true to auto-run migrations on startup
          synchronize: isDevelopment && configService.get<string>('USE_MIGRATIONS', 'false') !== 'true',
          logging: isDevelopment,
          retryAttempts: 3,
          retryDelay: 3000,
          extra: {
            max: 10,
            connectionTimeoutMillis: 10000,
          },
        };
      },
      inject: [ConfigService],
    }),
    MembershipModule,
    DealModule,
  ],
  controllers: [HealthController],
  providers: [AppConfigService],
})
export class AppModule {}