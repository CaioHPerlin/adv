import { Module } from '@nestjs/common';
import { ConfigModule as NestConfigModule } from '@nestjs/config';
import { validateEnvironmentVariables } from './environment-variables';

@Module({
  imports: [
    NestConfigModule.forRoot({
      cache: true,
      validate: validateEnvironmentVariables,
    }),
  ],
})
export class ConfigModule {}
