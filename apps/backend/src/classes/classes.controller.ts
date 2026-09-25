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
import { ClassesService } from './classes.service.js';
import { Prisma } from '../generated/prisma/client.js';
import { ApiResponse } from '@nestjs/swagger';
import { ZodResponse } from 'nestjs-zod';
import { RoleGuard } from '../common/guard/role.guard.js';
import { Roles } from '../common/guard/roles.decorator.js';

@Controller('classes')
@UseGuards(RoleGuard)
@Roles('teacher')
export class ClassesController {
  constructor(private readonly classesService: ClassesService) {}
  @Get()
  // @ZodResponse({ type: ClassesResponse })
  @ApiResponse({ summary: 'Get all classes with filters and pagination' })
  async findAll(
    @Query('search') search?: string,
    @Query('subject') subject?: string,
    @Query('teacher') teacher?: string,
    @Query('page') page?: string,
    @Query('limit') limit?: string,
  ) {
    return this.classesService.findAll({
      search,
      subject,
      teacher,
      page,
      limit,
    });
  }
  // @ZodResponse({ type: CreateClassResponse })
  @ApiResponse({ summary: 'Create a new class' })
  @Post()
  async create(@Body() body: Prisma.ClassCreateInput) {
    return this.classesService.create(body);
  }

  @Get(':id')
  // @ZodResponse({ type: ClassResponse })
  @ApiResponse({ summary: 'Get class details by ID' })
  async findOne(@Param('id', ParseIntPipe) id: number) {
    return this.classesService.findOne(id);
  }

  @Get(':id/users')
  // @ZodResponse({ type: PaginatedUsersResponse })
  @ApiResponse({ summary: 'Get users in a class by role' })
  async findUsers(
    @Param('id', ParseIntPipe) id: number,
    @Query('role') role: string,
    @Query('page') page?: string,
    @Query('limit') limit?: string,
  ) {
    return this.classesService.findUsers(id, role, { page, limit });
  }
}
