import { Module } from '@nestjs/common';
import { HashService } from 'src/common/providers/hash.service';
import { PrismaModule } from 'src/prisma/prisma.module';
import { UsersController } from './users.controller';
import { UsersRepository } from './users.repository';
import { UsersService } from './users.service';

@Module({
  imports: [PrismaModule],
  providers: [UsersRepository, HashService, UsersService],
  controllers: [UsersController],
  exports: [UsersService],
})
export class UsersModule {}
