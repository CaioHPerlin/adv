import { Injectable } from '@nestjs/common';
import { UsersService } from 'src/core/users/users.service';
import { UserDto } from '../users/dto/user.dto';
import { SignUpDto } from './dto/sign-up.dto';
import { JwtService } from '@nestjs/jwt';
import { JwtPayload } from './jwt/jwt-payload.interface';

@Injectable()
export class AuthService {
  constructor(
    private readonly usersService: UsersService,
    private readonly jwtService: JwtService,
  ) {}

  async validateUser(
    email: string,
    plainPassword: string,
  ): Promise<UserDto | null> {
    return this.usersService.verifyCredentials(email, plainPassword);
  }

  async signIn(user: UserDto): Promise<{ accessToken: string; user: UserDto }> {
    const payload: JwtPayload = {
      sub: user.id,
      email: user.email,
      name: user.name,
    };
    const accessToken = await this.jwtService.signAsync(payload);
    return { accessToken, user };
  }

  async signUp(signUpDto: SignUpDto): Promise<UserDto> {
    return this.usersService.create(signUpDto);
  }
}
