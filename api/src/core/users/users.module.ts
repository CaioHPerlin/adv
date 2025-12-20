import { Module } from '@nestjs/common';
import { UsersService } from './users.service';
import { HashService } from 'src/common/providers/hash.service';
import { UsersRepository } from './users.repository';
import { PrismaModule } from 'src/prisma/prisma.module';

@Module({
  imports: [PrismaModule],
  providers: [UsersRepository, HashService, UsersService],
  exports: [UsersService],
})
export class UsersModule {}
