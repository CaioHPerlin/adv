import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsString, MinLength } from 'class-validator';
import { CreateUserDto } from 'src/core/users/dto/create-user.dto';

export class SignUpDto implements CreateUserDto {
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
