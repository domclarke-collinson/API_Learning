import { NestFactory } from '@nestjs/core';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Module } from '@nestjs/common';
import { join } from 'path';
import { Deal } from '../deals/deal.entity';
import { Membership } from '../membership/membership.entity';
import { SeedService } from '../app/modules/database/seed/seed.service';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: ['.env'],
    }),
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: (configService: ConfigService) => ({
        type: 'postgres',
        host: configService.get<string>('DB_HOST', 'localhost'),
        port: configService.get<number>('DB_PORT', 5438),
        username: configService.get<string>('DB_USERNAME', 'myuser'),
        password: configService.get<string>('DB_PASSWORD', 'mypassword'),
        database: configService.get<string>('DB_NAME', 'mydb'),
        entities: [join(__dirname, '..', '**', '*.entity.{ts,js}')],
        synchronize: configService.get<string>('NODE_ENV', 'development') === 'development',
        logging: configService.get<string>('NODE_ENV', 'development') === 'development',
        retryAttempts: 3,
        retryDelay: 3000,
        extra: {
          max: 10,
          connectionTimeoutMillis: 10000,
        },
      }),
      inject: [ConfigService],
    }),
    TypeOrmModule.forFeature([Deal, Membership]),
  ],
  providers: [SeedService],
})
class SeedModule {}

async function bootstrap() {
  const app = await NestFactory.createApplicationContext(SeedModule);
  
  const seedService = app.get(SeedService);
  
  await seedService.seed();
  await app.close();
}

bootstrap()
  .then(() => {
    console.log('Seeding completed');
    process.exit(0);
  })
  .catch((error) => {
    console.error('Seeding failed:', error);
    process.exit(1);
  });