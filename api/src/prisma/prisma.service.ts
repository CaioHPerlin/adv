import { Injectable } from '@nestjs/common';
import { PrismaClient } from './generated/client';
import { PrismaBetterSqlite3 } from '@prisma/adapter-better-sqlite3';
import { ConfigService } from '@nestjs/config';
import { EnvironmentVariables } from 'src/config/environment-variables';

@Injectable()
export class PrismaService extends PrismaClient {
  constructor(configService: ConfigService<EnvironmentVariables>) {
    const adapter = new PrismaBetterSqlite3({
      url: configService.get('DATABASE_URL'),
    });
    super({ adapter });
  }
}
