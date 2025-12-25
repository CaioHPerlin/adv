import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { Case } from './entities/case.entity';
import { CreateCaseDto } from './dto/create-case.dto';
import { Prisma } from 'src/prisma/generated/client';

@Injectable()
export class CasesRepository {
  constructor(private readonly prismaService: PrismaService) {}

  async findByNumber(number: string): Promise<Case | null> {
    return this.prismaService.case.findUnique({ where: { number } });
  }

  async create(
    createCaseDto: CreateCaseDto,
    createdByUserId: number,
  ): Promise<Case> {
    return this.prismaService.case.create({
      data: {
        ...createCaseDto,
        createdByUser: { connect: { id: createdByUserId } },
        distributionDate: new Date(createCaseDto.distributionDate),
      },
    });
  }

  async findAll(): Promise<Case[]> {
    return this.prismaService.case.findMany();
  }

  async findAssignedToUser(userId: number): Promise<Case[]> {
    return this.prismaService.case.findMany({
      where: {
        assignedUsers: {
          some: {
            user: {
              id: userId,
            },
          },
        },
      },
    });
  }
}
