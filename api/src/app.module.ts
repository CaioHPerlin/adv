import { Module } from '@nestjs/common';
import { CoreModule } from './core/core.module';
import { ConfigModule } from './config/config.module';
import { CasesModule } from './cases/cases.module';

@Module({
  imports: [CoreModule, ConfigModule, CasesModule],
  providers: [],
})
export class AppModule {}
