import {
  Controller,
  Get,
  Post,
  Body,
  HttpCode,
  HttpStatus,
  Query,
  Param,
  UseGuards,
} from '@nestjs/common';
import { SubjectsService } from './subjects.service.js';
import { RoleGuard } from '../common/guard/role.guard.js';
import { Roles } from '../common/guard/roles.decorator.js';
import { ApiResponse, ApiTags } from '@nestjs/swagger';
import { ZodResponse } from 'nestjs-zod';
import { SubjectRequest } from '../common/schema/request/classroom.request.dto.js';
import { AllSubjectsResponse } from '../common/schema/response/classroom.response.schema.js';

@Controller('subjects')
@UseGuards(RoleGuard)
@Roles('teacher')
@ApiTags('Subjects')
export class SubjectsController {
  constructor(private readonly subjectsService: SubjectsService) {}

  @Get()
  // @ZodResponse({ type: AllSubjectsResponse })
  @ApiResponse({ summary: 'Lists all subjects' })
  async findAll(
    @Query('search') search?: string,
    @Query('department') department?: string,
    @Query('page') page?: number,
    @Query('limit') limit?: number,
  ) {
    return this.subjectsService.findAll(search, department, page, limit);
  }

  @Post()
  @HttpCode(HttpStatus.CREATED)
  // @ZodResponse({ type: SubjectResponse })
  @ApiResponse({ summary: 'Creates a new subject' })
  async create(
    @Body()
    body: SubjectRequest,
  ) {
    return this.subjectsService.create(body);
  }
  // @ZodResponse({ type: SubjetsDetailsResponse })
  @ApiResponse({ summary: 'Returns a specific subject details with counts' })
  @Get(':id')
  async findOne(@Param('id') id: string) {
    return this.subjectsService.findOne(Number(id));
  }

  @ApiResponse({ summary: 'Returns a specific subject classes with counts' })
  @Get(':id/classes')
  async findClasses(
    @Param('id') id: string,
    @Query('page') page?: number,
    @Query('limit') limit?: number,
  ) {
    return this.subjectsService.findClasses(Number(id), page, limit);
  }

  @Get(':id/users')
  @ApiResponse({ summary: 'Returns Users per subject' })
  async findUsers(
    @Param('id') id: string,
    @Query('role') role: string,
    @Query('page') page?: number,
    @Query('limit') limit?: number,
  ) {
    return this.subjectsService.findUsers(Number(id), role, page, limit);
  }
}
