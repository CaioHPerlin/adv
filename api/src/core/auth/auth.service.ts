import { Injectable } from '@nestjs/common';
import { UsersService } from 'src/core/users/users.service';

@Injectable()
export class AuthService {
  constructor(private readonly usersService: UsersService) {}

  async validateUser(email: string, plainPassword: string): Promise<boolean> {
    const { userId } = await this.usersService.verifyCredentials(
      email,
      plainPassword,
    );

    return userId !== null;
  }
}
