import { Injectable } from '@nestjs/common';
import { PrismaPg } from '@prisma/adapter-pg';
import { TypedConfigService } from 'src/config/typed-config.service';
import { PrismaClient } from './generated/client';

@Injectable()
export class PrismaService extends PrismaClient {
  constructor(configService: TypedConfigService) {
    const adapter = new PrismaPg({
      url: configService.get('DATABASE_URL'),
    });
    super({ adapter });
  }
}
