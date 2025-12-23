import { User } from '../entities/user.entity';

export class CreateUserDto implements Partial<User> {
  email: string;
  name: string;
  password: string;
}
