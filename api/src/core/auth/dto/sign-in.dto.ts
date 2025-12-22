import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsString } from 'class-validator';

export class SignInDto {
  @ApiProperty({ example: 'among@us.com' })
  @IsEmail()
  email: string;

  @ApiProperty({ example: 'ThePassword!' })
  @IsString()
  password: string;
}
