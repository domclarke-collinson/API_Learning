import { Module } from "@nestjs/common";
import { MembershipModule, Membership } from "src/membership";
import { HealthController } from "./modules/health/health.controller";
import { ConfigModule } from "@nestjs/config";
import { TypeOrmModule } from "@nestjs/typeorm";

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    
    // TypeORM configuration - connects to PostgreSQL database
    TypeOrmModule.forRoot({
      type: 'postgres',
      host: process.env.DB_HOST || 'localhost',
      port: parseInt(process.env.DB_PORT || '5438', 10),
      username: process.env.DB_USERNAME || 'myuser',
      password: process.env.DB_PASSWORD || 'mypassword',
      database: process.env.DB_NAME || 'mydb',
      entities: [Membership],
      synchronize: false,
      logging: true,
      // Add connection retry logic
      retryAttempts: 3,
      retryDelay: 3000,
      // Add connection timeout
      connectTimeoutMS: 10000,
      // Better error messages
      extra: {
        max: 10, // Maximum number of connections in the pool
        connectionTimeoutMillis: 10000,
      },
    }),
    
    MembershipModule
  ],
  controllers: [HealthController],
  providers: [],
})
export class AppModule {}