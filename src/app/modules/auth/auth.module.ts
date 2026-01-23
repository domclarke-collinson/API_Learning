import { HttpModule } from '@nestjs/axios';
import { DynamicModule, Module } from '@nestjs/common';
import { AppConfigModule } from '../../config/config.module';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { AuthGuard } from './guards/auth.guard';

@Module({})
export class AuthServiceModule {
  static forRoot(): DynamicModule {
    return {
      module: AuthServiceModule,
      imports: [HttpModule, AppConfigModule],
      controllers: [AuthController],
      providers: [AuthService, AuthGuard],
      exports: [AuthService, AuthGuard]
    };
  }
}
