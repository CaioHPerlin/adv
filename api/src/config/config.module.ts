import { Module } from '@nestjs/common';
import { ConfigModule as NestConfigModule } from '@nestjs/config';
import { validateEnvironmentVariables } from './environment-variables';
import { TypedConfigService } from './typed-config.service';

@Module({
  imports: [
    NestConfigModule.forRoot({
      cache: true,
      validate: validateEnvironmentVariables,
    }),
  ],
  providers: [TypedConfigService],
  exports: [TypedConfigService],
})
export class ConfigModule {}
