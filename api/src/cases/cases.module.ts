import { Module } from '@nestjs/common';
import { CasesService } from './cases.service';
import { CasesController } from './cases.controller';
import { PrismaModule } from 'src/prisma/prisma.module';
import { CasesRepository } from './cases.repository';

@Module({
  imports: [PrismaModule],
  controllers: [CasesController],
  providers: [CasesRepository, CasesService],
})
export class CasesModule {}
