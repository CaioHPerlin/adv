import {
  IsDateString,
  IsNotEmpty,
  IsOptional,
  IsString,
} from 'class-validator';
import { Case } from '../entities/case.entity';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

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
}
