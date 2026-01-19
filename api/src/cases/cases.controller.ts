import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseIntPipe,
  Patch,
  Post,
  Request,
  UseGuards,
} from '@nestjs/common';
import { ApiBearerAuth } from '@nestjs/swagger';
import { JwtAuthGuard } from 'src/core/auth/guards/jwt-auth.guard';
import { JwtPayload } from 'src/core/auth/jwt/jwt-payload.interface';
import { CasesService } from './cases.service';
import { AssignUsersDto } from './dto/assign-users.dto';
import { CreateCaseDto } from './dto/create-case.dto';
import { UpdateCaseDto } from './dto/update-case.dto';

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

  @Patch(':id')
  update(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateCaseDto: UpdateCaseDto,
  ) {
    return this.casesService.update(id, updateCaseDto);
  }

  @Post(':id/assign-users')
  assignUsers(
    @Param('id', ParseIntPipe) id: number,
    @Body() assignUsersDto: AssignUsersDto,
  ) {
    return this.casesService.assignUsers(id, assignUsersDto.userIds);
  }

  @Delete(':id')
  remove(@Param('id', ParseIntPipe) id: number) {
    return this.casesService.remove(id);
  }
}
