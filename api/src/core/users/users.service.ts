import { ConflictException, Injectable } from '@nestjs/common';
import { UsersRepository } from './users.repository';
import { HashService } from 'src/common/providers/hash.service';
import { UserDto } from './dto/user.dto';
import { plainToClass } from 'class-transformer';
import { CreateUserDto } from './dto/create-user.dto';

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

  async create(createUserDto: CreateUserDto): Promise<UserDto> {
    const existingUser = await this.usersRepository.findByEmail(
      createUserDto.email,
    );
    if (existingUser) {
      throw new ConflictException('Email already in use.');
    }

    const hashedPassword = await this.hashService.hash(createUserDto.password);

    const user = await this.usersRepository.create({
      ...createUserDto,
      password: hashedPassword,
    });

    return plainToClass(UserDto, user);
  }
}
