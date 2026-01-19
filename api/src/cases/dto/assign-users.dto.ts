import { ApiProperty } from '@nestjs/swagger';
import { IsArray, IsNumber } from 'class-validator';

export class AssignUsersDto {
  @ApiProperty({ example: [1, 2, 3] })
  @IsArray()
  @IsNumber({}, { each: true })
  userIds: number[];
}
