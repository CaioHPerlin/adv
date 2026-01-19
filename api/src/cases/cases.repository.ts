import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { CreateCaseDto } from './dto/create-case.dto';
import { UpdateCaseDto } from './dto/update-case.dto';
import { Case } from './entities/case.entity';

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
    const { assignedUserIds, ...caseData } = createCaseDto;
    return this.prismaService.case.create({
      data: {
        ...caseData,
        createdByUser: { connect: { id: createdByUserId } },
        distributionDate: new Date(caseData.distributionDate),
        assignedUsers: assignedUserIds
          ? {
              createMany: {
                data: assignedUserIds.map((userId) => ({
                  userId,
                })),
              },
            }
          : undefined,
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

  async assignUsersToCase(caseId: number, userIds: number[]): Promise<Case> {
    const existingCase = await this.prismaService.case.findUnique({
      where: { id: caseId },
    });

    if (!existingCase) {
      throw new NotFoundException(`Case with ID ${caseId} not found`);
    }

    // Delete existing assignments
    await this.prismaService.userCase.deleteMany({
      where: { caseId },
    });

    // Create new assignments
    await this.prismaService.userCase.createMany({
      data: userIds.map((userId) => ({
        userId,
        caseId,
      })),
    });

    const updatedCase = await this.prismaService.case.findUnique({
      where: { id: caseId },
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

    if (!updatedCase) {
      throw new NotFoundException(`Case with ID ${caseId} not found`);
    }

    return updatedCase;
  }

  async remove(id: number): Promise<void> {
    const existingCase = await this.prismaService.case.findUnique({
      where: { id },
    });

    if (!existingCase) {
      throw new NotFoundException(`Case with ID ${id} not found`);
    }

    // Delete all assignments first
    await this.prismaService.userCase.deleteMany({
      where: { caseId: id },
    });

    await this.prismaService.case.delete({
      where: { id },
    });
  }
}
