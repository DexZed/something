import {
  ConflictException,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';

import { prisma } from '../lib/prisma.js';

@Injectable()
export class EnrolmentsService {
  /**
   * Helper to fetch enrollment with deep relations
   */
  async getEnrollmentDetails(enrollmentId: number) {
    return prisma.enrollment.findUnique({
      where: { id: enrollmentId },
      include: {
        class: {
          include: {
            subject: {
              include: {
                department: true,
              },
            },
            teacher: true,
          },
        },
        student: true,
      },
    });
  }

  /**
   * Create an enrollment directly by classId and studentId
   */
  async create(dto: any) {
    const { classId, studentId } = dto;

    const classRecord = await prisma.class.findUnique({
      where: { id: classId },
    });
    if (!classRecord) {
      throw new NotFoundException('Class not found');
    }

    const student = await prisma.user.findUnique({
      where: { id: studentId },
    });
    if (!student) {
      throw new NotFoundException('Student not found');
    }

    const existingEnrollment = await prisma.enrollment.findFirst({
      where: { classId, studentId },
    });
    if (existingEnrollment) {
      throw new ConflictException('Student already enrolled in class');
    }

    try {
      const created = await prisma.enrollment.create({
        data: { classId, studentId },
      });

      return await this.getEnrollmentDetails(created.id);
    } catch (error) {
      console.error('Failed to create enrollment:', error);
      throw new InternalServerErrorException('Failed to create enrollment');
    }
  }

  /**
   * Join a class using an inviteCode
   */
  async joinByInviteCode(dto: any) {
    const { inviteCode, studentId } = dto;

    const classRecord = await prisma.class.findUnique({
      where: { inviteCode },
    });
    if (!classRecord) {
      throw new NotFoundException('Class not found');
    }

    const student = await prisma.user.findUnique({
      where: { id: studentId },
    });
    if (!student) {
      throw new NotFoundException('Student not found');
    }

    const existingEnrollment = await prisma.enrollment.findFirst({
      where: { classId: classRecord.id, studentId },
    });
    if (existingEnrollment) {
      throw new ConflictException('Student already enrolled in class');
    }

    try {
      const created = await prisma.enrollment.create({
        data: { classId: classRecord.id, studentId },
      });

      return await this.getEnrollmentDetails(created.id);
    } catch (error) {
      console.error('Failed to join class:', error);
      throw new InternalServerErrorException('Failed to join class');
    }
  }
}
