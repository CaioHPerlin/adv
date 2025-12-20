import { Injectable } from '@nestjs/common';
import { Prisma } from 'src/prisma/generated/client';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class UsersRepository {
  constructor(private readonly prismaService: PrismaService) {}

  async findByEmail(email: string): Promise<Prisma.UserModel | null> {
    return this.prismaService.user.findUnique({
      where: { email },
    });
  }
}
