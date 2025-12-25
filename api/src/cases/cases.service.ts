import { ConflictException, Injectable } from '@nestjs/common';
import { CreateCaseDto } from './dto/create-case.dto';
import { CasesRepository } from './cases.repository';
import { CaseDto } from './dto/case.dto';
import { Case } from './entities/case.entity';
import { plainToClass } from 'class-transformer';

@Injectable()
export class CasesService {
  constructor(private readonly casesRepository: CasesRepository) {}

  private toDto(entity: Case): CaseDto {
    return plainToClass(CaseDto, entity);
  }

  async create(
    createCaseDto: CreateCaseDto,
    createdByUserId: number,
  ): Promise<CaseDto | null> {
    const existingCase = await this.casesRepository.findByNumber(
      createCaseDto.number,
    );
    if (existingCase) {
      throw new ConflictException('Case number already in use.');
    }

    const newCase = await this.casesRepository.create(
      createCaseDto,
      createdByUserId,
    );
    return this.toDto(newCase);
  }

  async findAll(): Promise<CaseDto[]> {
    const cases = await this.casesRepository.findAll();
    return cases.map((c) => this.toDto(c));
  }

  async findAssignedToUser(userId: number): Promise<CaseDto[]> {
    const cases = await this.casesRepository.findAssignedToUser(userId);
    return cases.map((c) => this.toDto(c));
  }
}
