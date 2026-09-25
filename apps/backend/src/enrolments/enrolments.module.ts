import { Module } from '@nestjs/common';
import { EnrolmentsService } from './enrolments.service.js';
import { EnrolmentsController } from './enrolments.controller.js';

@Module({
  controllers: [EnrolmentsController],
  providers: [EnrolmentsService],
})
export class EnrolmentsModule {}
