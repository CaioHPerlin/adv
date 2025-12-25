import { Case } from '../entities/case.entity';

export class CaseDto implements Case {
  number: string;
  id: number;
  court: string;
  clientName: string;
  distributionDate: Date;
  description: string;
  createdAt: Date;
  updatedAt: Date;
  createdByUserId: number;
}
