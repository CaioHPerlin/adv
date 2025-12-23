import { Injectable } from '@nestjs/common';
import { UsersService } from 'src/core/users/users.service';
import { UserDto } from '../users/dto/user.dto';
import { SignUpDto } from './dto/sign-up.dto';

@Injectable()
export class AuthService {
  constructor(private readonly usersService: UsersService) {}

  async validateUser(
    email: string,
    plainPassword: string,
  ): Promise<UserDto | null> {
    return this.usersService.verifyCredentials(email, plainPassword);
  }

  async signUp(signUpDto: SignUpDto): Promise<UserDto> {
    return this.usersService.create(signUpDto);
  }
}
