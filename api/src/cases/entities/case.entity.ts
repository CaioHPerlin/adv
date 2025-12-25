import { Prisma } from 'src/prisma/generated/client';

export class Case implements Prisma.CaseModel {
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
