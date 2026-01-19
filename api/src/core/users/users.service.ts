import { ConflictException, Injectable } from '@nestjs/common';
import { plainToClass } from 'class-transformer';
import { HashService } from 'src/common/providers/hash.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UserDto } from './dto/user.dto';
import { UsersRepository } from './users.repository';

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

  async findAll(): Promise<UserDto[]> {
    const users = await this.usersRepository.findAll();
    return users.map((user) => plainToClass(UserDto, user));
  }

  async findById(id: number): Promise<UserDto | null> {
    const user = await this.usersRepository.findById(id);
    if (!user) {
      return null;
    }
    return plainToClass(UserDto, user);
  }
}
