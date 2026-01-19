import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import {
  IsArray,
  IsDateString,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
} from 'class-validator';
import { Case } from '../entities/case.entity';

export class CreateCaseDto implements Partial<Case> {
  @ApiProperty({ example: '12345' })
  @IsString()
  @IsNotEmpty()
  number: string;

  @ApiProperty({ example: 'Tribunal de Lá' })
  @IsString()
  @IsNotEmpty()
  court: string;

  @ApiProperty({ example: 'Sir Edmund Rockwell' })
  @IsString()
  @IsNotEmpty()
  clientName: string;

  @ApiPropertyOptional({ example: 'descrição importante sobre o processo' })
  @IsString()
  @IsOptional()
  description: string;

  @ApiProperty({ example: '2026-05-02' })
  @IsDateString()
  distributionDate: Date;

  @ApiPropertyOptional({ example: [1, 2, 3] })
  @IsArray()
  @IsNumber({}, { each: true })
  @IsOptional()
  assignedUserIds?: number[];
}
