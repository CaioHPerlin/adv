import { Injectable } from '@nestjs/common';
import { UsersRepository } from './users.repository';
import { HashService } from 'src/common/providers/hash.service';

@Injectable()
export class UsersService {
  constructor(
    private readonly usersRepository: UsersRepository,
    private readonly hashService: HashService,
  ) {}

  async verifyCredentials(
    email: string,
    plainPassword: string,
  ): Promise<{ userId: number | null }> {
    const user = await this.usersRepository.findByEmail(email);

    if (!user) {
      return { userId: null };
    }

    const isValid = await this.hashService.verify(user.password, plainPassword);

    if (!isValid) {
      return { userId: null };
    }

    return { userId: user.id };
  }
}
