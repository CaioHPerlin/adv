import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsString, MinLength } from 'class-validator';
import { User } from '../entities/user.entity';

export class CreateUserDto implements Partial<User> {
  @ApiProperty({ example: 'Anders Fridén' })
  @IsString()
  @MinLength(2)
  name: string;

  @ApiProperty({ example: 'anders@inflames.com' })
  @IsEmail()
  email: string;

  @ApiProperty({ example: '0nly4theWeak123' })
  @IsString()
  @MinLength(6)
  password: string;
}
