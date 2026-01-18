import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { Case } from './entities/case.entity';
import { CreateCaseDto } from './dto/create-case.dto';
import { UpdateCaseDto } from './dto/update-case.dto';
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
    return this.prismaService.case.findMany({
      include: {
        assignedUsers: {
          include: {
            user: {
              select: {
                id: true,
                email: true,
                name: true,
              },
            },
          },
        },
      },
    });
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
      include: {
        assignedUsers: {
          include: {
            user: {
              select: {
                id: true,
                email: true,
                name: true,
              },
            },
          },
        },
      },
    });
  }

  async update(id: number, updateCaseDto: UpdateCaseDto): Promise<Case> {
    const existingCase = await this.prismaService.case.findUnique({
      where: { id },
    });

    if (!existingCase) {
      throw new NotFoundException(`Case with ID ${id} not found`);
    }

    const updateData: any = { ...updateCaseDto };
    if (updateCaseDto.distributionDate) {
      updateData.distributionDate = new Date(updateCaseDto.distributionDate);
    }

    return this.prismaService.case.update({
      where: { id },
      data: updateData,
      include: {
        assignedUsers: {
          include: {
            user: {
              select: {
                id: true,
                email: true,
                name: true,
              },
            },
          },
        },
      },
    });
  }

  async remove(id: number): Promise<void> {
    const existingCase = await this.prismaService.case.findUnique({
      where: { id },
    });

    if (!existingCase) {
      throw new NotFoundException(`Case with ID ${id} not found`);
    }

    await this.prismaService.case.delete({
      where: { id },
    });
  }
}
