import { Module } from '@nestjs/common';
import { CoreModule } from './core/core.module';
import { ConfigModule } from './config/config.module';

@Module({
  imports: [CoreModule, ConfigModule],
  providers: [],
})
export class AppModule {}
