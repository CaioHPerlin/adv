import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsString } from 'class-validator';

export class SignInDto {
  @ApiProperty({ example: 'anders@inflames.com' })
  @IsEmail()
  email: string;

  @ApiProperty({ example: '0nly4theWeak123' })
  @IsString()
  password: string;
}
