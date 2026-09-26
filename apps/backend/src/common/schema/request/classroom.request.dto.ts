import z from 'zod';
import { createZodDto } from 'nestjs-zod';

export class CreateDepartmentRequest extends createZodDto(
  z.object({
    code: z.string('Code must be a string').nonempty('Code is required'),
    name: z.string('Name must be a string').nonempty('Name is required'),
    description: z.string('Description must be a string').optional(),
  }),
) {}
export class CreateEnrollmentRequest extends createZodDto(
  z.object({
    classId: z.number('Class ID must be a number'),
    studentId: z.string('Student ID must be a number'),
  }),
) {}
export class JoinEnrollmentRequest extends createZodDto(
  z.object({
    inviteCode: z.string('Invite code must be a string'),
    studentId: z.string('Student ID must be a number'),
  }),
) {}
export class PaymentCheckoutRequest extends createZodDto(
  z.object({
    classId: z.number('Class ID must be a number'),
  }),
) {}

export class SubjectRequest extends createZodDto(
  z.object({
    departmentId: z.number('Department ID must be a number'),
    code: z.string('Code must be a string').nonempty('Code is required'),
    name: z.string('Name must be a string').nonempty('Name is required'),
    description: z.string('Description must be a string').optional(),
  }),
) {}
