import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
  Request,
  ConflictException,
  ParseIntPipe,
} from '@nestjs/common';
import { CasesService } from './cases.service';
import { CreateCaseDto } from './dto/create-case.dto';
import { UpdateCaseDto } from './dto/update-case.dto';
import { ApiBearerAuth } from '@nestjs/swagger';
import { JwtAuthGuard } from 'src/core/auth/guards/jwt-auth.guard';
import { JwtPayload } from 'src/core/auth/jwt/jwt-payload.interface';

@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller('cases')
export class CasesController {
  constructor(private readonly casesService: CasesService) {}

  @Post()
  create(
    @Body() createCaseDto: CreateCaseDto,
    @Request() req: { user: JwtPayload },
  ) {
    return this.casesService.create(createCaseDto, req.user.sub);
  }

  @Get()
  findAll() {
    return this.casesService.findAll();
  }

  @Get('/assigned')
  findAssignedToSelf(@Request() req: { user: JwtPayload }) {
    return this.casesService.findAssignedToUser(req.user.sub);
  }

  @Get('/assigned/:id')
  findAssigned(@Param('id', ParseIntPipe) id: number) {
    return this.casesService.findAssignedToUser(id);
  }
}
