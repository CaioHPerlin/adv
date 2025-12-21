import { Injectable } from '@nestjs/common';
import { UsersService } from 'src/core/users/users.service';
import { UserDto } from '../users/dto/user.dto';

@Injectable()
export class AuthService {
  constructor(private readonly usersService: UsersService) {}

  async validateUser(
    email: string,
    plainPassword: string,
  ): Promise<UserDto | null> {
    const userDto = await this.usersService.verifyCredentials(
      email,
      plainPassword,
    );

    return userDto;
  }
}
