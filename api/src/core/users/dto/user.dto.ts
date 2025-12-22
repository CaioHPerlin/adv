import { Exclude } from 'class-transformer';
import { User } from '../entities/user.entity';

export class UserDto implements User {
  name: string;
  id: number;
  email: string;
  createdAt: Date;
  updatedAt: Date;

  @Exclude()
  password: string;
}
