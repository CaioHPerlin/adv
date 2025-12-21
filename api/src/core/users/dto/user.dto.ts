import { Exclude } from 'class-transformer';
import { User } from '../entities/user.entity';

export class UserDto implements User {
  name: string;
  id: number;
  email: string;
  created_at: Date;
  updated_at: Date;

  @Exclude()
  password: string;
}
