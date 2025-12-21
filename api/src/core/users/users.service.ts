import { Injectable } from '@nestjs/common';
import { UsersRepository } from './users.repository';
import { HashService } from 'src/common/providers/hash.service';
import { UserDto } from './dto/user.dto';
import { plainToClass } from 'class-transformer';

@Injectable()
export class UsersService {
  constructor(
    private readonly usersRepository: UsersRepository,
    private readonly hashService: HashService,
  ) {}

  async verifyCredentials(
    email: string,
    plainPassword: string,
  ): Promise<UserDto | null> {
    const user = await this.usersRepository.findByEmail(email);
    if (!user) {
      return null;
    }

    const isValid = await this.hashService.verify(user.password, plainPassword);
    if (!isValid) {
      return null;
    }

    return plainToClass(UserDto, user);
  }
}
