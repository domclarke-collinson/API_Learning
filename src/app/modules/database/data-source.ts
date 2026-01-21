import { DataSource, DataSourceOptions } from 'typeorm';
import { ConfigService } from '@nestjs/config';
import { config } from 'dotenv';
import { join } from 'path';

// Load environment variables
config();

const configService = new ConfigService();

export const dataSourceOptions: DataSourceOptions = {
  type: 'postgres',
  host: configService.get<string>('DB_HOST', 'localhost'),
  port: configService.get<number>('DB_PORT', 5438),
  username: configService.get<string>('DB_USERNAME', 'myuser'),
  password: configService.get<string>('DB_PASSWORD', 'mypassword'),
  database: configService.get<string>('DB_NAME', 'mydb'),
  entities: [join(__dirname, '../../..', '**', '*.entity.{ts,js}')],
  migrations: [join(__dirname, 'migrations', '*.{ts,js}')],
  synchronize: false, // Always false when using migrations
  logging: configService.get<string>('NODE_ENV', 'development') === 'development',
};

const dataSource = new DataSource(dataSourceOptions);
export default dataSource;