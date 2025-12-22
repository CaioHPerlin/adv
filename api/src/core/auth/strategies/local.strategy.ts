import {
  BadRequestException,
  Injectable,
  UnauthorizedException,
  ValidationPipe,
} from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { Strategy } from 'passport-local';
import { AuthService } from '../auth.service';
import { UserDto } from 'src/core/users/dto/user.dto';
import { validateSync } from 'class-validator';
import { plainToInstance } from 'class-transformer';
import { SignInDto } from '../dto/sign-in.dto';

@Injectable()
export class LocalStrategy extends PassportStrategy(Strategy) {
  constructor(private readonly authService: AuthService) {
    super({
      usernameField: 'email',
      passwordField: 'password',
    });
  }

  private validateSignInDto(email: string, password: string): SignInDto {
    const object = { email, password };

    const transformed = plainToInstance(SignInDto, object);
    const errors = validateSync(transformed, {
      whitelist: true,
      forbidNonWhitelisted: true,
    });

    if (errors.length > 0) {
      throw new BadRequestException(errors.toString());
    }

    return transformed;
  }

  async validate(email: string, plainPassword: string): Promise<UserDto> {
    const dto = this.validateSignInDto(email, plainPassword);

    const user = await this.authService.validateUser(dto.email, dto.password);
    if (!user) {
      throw new UnauthorizedException();
    }

    return user;
  }
}
