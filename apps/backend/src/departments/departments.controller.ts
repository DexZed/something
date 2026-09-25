import {
  Body,
  Controller,
  Get,
  Param,
  ParseIntPipe,
  Post,
  Query,
  UseGuards,
} from '@nestjs/common';
import { DepartmentsService } from './departments.service.js';
import { RoleGuard } from '../common/guard/role.guard.js';
import { Roles } from '../common/guard/roles.decorator.js';
import { ApiResponse, ApiTags } from '@nestjs/swagger';
import { ZodResponse } from 'nestjs-zod';
@Controller('departments')
@UseGuards(RoleGuard)
@Roles('teacher')
@ApiTags('Departments')
export class DepartmentsController {
  constructor(private readonly departmentsService: DepartmentsService) {}

  @Get()
  // @ZodResponse({ type: DepartmentsResponse })
  @ApiResponse({ summary: 'Get all departments with search and pagination' })
  async findAll(
    @Query('search') search?: string,
    @Query('page') page?: string,
    @Query('limit') limit?: string,
  ) {
    return this.departmentsService.findAll({ search, page, limit });
  }

  @Post()
  // @ZodResponse({ type: CreateDepartmentResponse })
  @ApiResponse({ summary: 'Create a new department' })
  async create(
    @Body()
    body: {
      code: string;
      name: string;
      description?: string;
    },
  ) {
    return this.departmentsService.create(body);
  }

  @Get(':id')
  // @ZodResponse({ type: DepartmentDetailsResponse })
  @ApiResponse({ summary: 'Get department details by ID with statistics' })
  async findOne(@Param('id', ParseIntPipe) id: number) {
    return this.departmentsService.findOne(id);
  }

  @Get(':id/subjects')
  // @ZodResponse({ type: DepartmentSubjectsResponse })
  @ApiResponse({ summary: 'List subjects in a department with pagination' })
  async findSubjects(
    @Param('id', ParseIntPipe) id: number,
    @Query('page') page?: string,
    @Query('limit') limit?: string,
  ) {
    return this.departmentsService.findSubjects(id, { page, limit });
  }

  @Get(':id/classes')
  // @ZodResponse({ type: DepartmentClassesResponse })
  @ApiResponse({ summary: 'List classes in a department with pagination' })
  async findClasses(
    @Param('id', ParseIntPipe) id: number,
    @Query('page') page?: string,
    @Query('limit') limit?: string,
  ) {
    return this.departmentsService.findClasses(id, { page, limit });
  }

  @Get(':id/users')
  // @ZodResponse({ type: DepartmentUsersResponse })
  @ApiResponse({
    summary: 'List users in a department by role with pagination',
  })
  async findUsers(
    @Param('id', ParseIntPipe) id: number,
    @Query('role') role: string,
    @Query('page') page?: string,
    @Query('limit') limit?: string,
  ) {
    return this.departmentsService.findUsers(id, role, { page, limit });
  }
}
