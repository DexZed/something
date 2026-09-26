import {
  Controller,
  Post,
  Body,
  HttpCode,
  HttpStatus,
  UseGuards,
} from '@nestjs/common';
import { EnrolmentsService } from './enrolments.service.js';
import { RoleGuard } from '../common/guard/role.guard.js';
import { Roles } from '../common/guard/roles.decorator.js';
import { ApiResponse, ApiTags } from '@nestjs/swagger';
import { ZodResponse } from 'nestjs-zod';
import {
  CreateEnrollmentRequest,
  JoinEnrollmentRequest,
} from '../common/schema/request/classroom.request.dto.js';

@Controller('enrolments')
@UseGuards(RoleGuard)
@Roles('student')
@ApiTags('Enrolments')
export class EnrolmentsController {
  constructor(private readonly enrolmentsService: EnrolmentsService) {}

  @Post()
  @ApiResponse({ summary: 'Create an Enrolement' })
  @HttpCode(HttpStatus.CREATED)
  async create(@Body() createEnrollmentDto: CreateEnrollmentRequest) {
    const enrollment = await this.enrolmentsService.create(createEnrollmentDto);
    return { data: enrollment };
  }

  @Post('join')
  @ApiResponse({ summary: 'Join an Enrolement' })
  @HttpCode(HttpStatus.CREATED)
  async join(@Body() joinEnrollmentDto: JoinEnrollmentRequest) {
    const enrollment =
      await this.enrolmentsService.joinByInviteCode(joinEnrollmentDto);
    return { data: enrollment };
  }
}
