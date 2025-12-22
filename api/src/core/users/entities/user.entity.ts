import { Prisma } from 'src/prisma/generated/client';

export class User implements Prisma.UserModel {
  name: string;
  id: number;
  email: string;
  password: string;
  createdAt: Date;
  updatedAt: Date;
}
