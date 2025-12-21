import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { Strategy } from 'passport-local';
import { AuthService } from '../auth.service';
import { UserDto } from 'src/core/users/dto/user.dto';

@Injectable()
export class LocalStrategy extends PassportStrategy(Strategy) {
  constructor(private readonly authService: AuthService) {
    super({
      usernameField: 'email',
      passwordField: 'password',
    });
  }

  async validate(email: string, plainPassword: string): Promise<UserDto> {
    const user = await this.authService.validateUser(email, plainPassword);
    if (!user) {
      throw new UnauthorizedException();
    }

    return user;
  }
}
