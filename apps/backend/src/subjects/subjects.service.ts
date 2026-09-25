import {
  BadRequestException,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';

import { Prisma } from '../generated/prisma/client.js';
import { prisma } from '../lib/prisma.js';

@Injectable()
export class SubjectsService {
  async create(dto: {
    departmentId: number;
    name: string;

    code: string;
    description?: string;
  }) {
    try {
      const createdSubject = await prisma.subject.create({
        data: dto,
        select: { id: true },
      });

      if (!createdSubject) {
        throw new Error();
      }

      return { data: createdSubject };
    } catch (error) {
      console.error('POST /subjects error:', error);
      throw new InternalServerErrorException('Failed to create subject');
    }
  }
  // Get all subjects with optional search, filtering and pagination
  async findAll(search?: string, department?: string, page = 1, limit = 10) {
    try {
      const currentPage = Math.max(1, Number(page));
      const limitPerPage = Math.max(1, Number(limit));
      const skip = (currentPage - 1) * limitPerPage;

      const where: Prisma.SubjectWhereInput = {};

      if (search) {
        where.OR = [
          { name: { contains: search, mode: 'insensitive' } },
          { code: { contains: search, mode: 'insensitive' } },
        ];
      }

      if (department) {
        where.department = {
          is: {
            name: {
              contains: department,
              mode: 'insensitive',
            },
          },
        };
      }
      // Count query MUST include the join
      const [totalCount, subjectsList] = await Promise.all([
        prisma.subject.count({ where }),
        prisma.subject.findMany({
          where,
          include: { department: true },
          orderBy: { createdAt: 'desc' },
          skip,
          take: limitPerPage,
        }),
      ]);

      return {
        data: subjectsList,
        pagination: {
          page: currentPage,
          limit: limitPerPage,
          total: totalCount,
          totalPages: Math.ceil(totalCount / limitPerPage),
        },
      };
    } catch (error) {
      console.error('GET /subjects error:', error);
      throw new InternalServerErrorException('Failed to fetch subjects');
    }
  }
  // Get subject details with counts
  async findOne(id: number) {
    if (!Number.isFinite(id)) {
      throw new BadRequestException('Invalid subject id');
    }

    try {
      const subject = await prisma.subject.findUnique({
        where: { id },
        include: { department: true },
      });

      if (!subject) {
        throw new NotFoundException('Subject not found');
      }

      const classesCount = await prisma.class.count({
        where: { subjectId: id },
      });

      return {
        data: {
          subject,
          totals: {
            classes: classesCount,
          },
        },
      };
    } catch (error) {
      if (
        error instanceof NotFoundException ||
        error instanceof BadRequestException
      ) {
        throw error;
      }
      console.error('GET /subjects/:id error:', error);
      throw new InternalServerErrorException('Failed to fetch subject details');
    }
  }
  // List classes in a subject with pagination
  async findClasses(id: number, page = 1, limit = 10) {
    const subjectId = Number(id);
    if (!Number.isFinite(subjectId)) {
      throw new BadRequestException('Invalid subject id');
    }

    const currentPage = Math.max(1, Number(page));
    const limitPerPage = Math.max(1, Number(limit));
    const skip = (currentPage - 1) * limitPerPage;

    try {
      const [totalCount, classesList] = await Promise.all([
        prisma.class.count({ where: { subjectId } }),
        prisma.class.findMany({
          where: { subjectId },
          include: { teacher: true },
          orderBy: { createdAt: 'desc' },
          skip,
          take: limitPerPage,
        }),
      ]);

      return {
        data: classesList,
        pagination: {
          page: currentPage,
          limit: limitPerPage,
          total: totalCount,
          totalPages: Math.ceil(totalCount / limitPerPage),
        },
      };
    } catch (error) {
      console.error('GET /subjects/:id/classes error:', error);
      throw new InternalServerErrorException('Failed to fetch subject classes');
    }
  }
  // List users in a subject by role with pagination

  async findUsers(id: number, role: string, page = 1, limit = 10) {
    const subjectId = Number(id);
    if (!Number.isFinite(subjectId)) {
      throw new BadRequestException('Invalid subject id');
    }

    if (role !== 'teacher' && role !== 'student') {
      throw new BadRequestException('Invalid role');
    }

    const currentPage = Math.max(1, Number(page));
    const limitPerPage = Math.max(1, Number(limit));
    const skip = (currentPage - 1) * limitPerPage;

    try {
      let totalCount = 0;
      let usersList = [];

      if (role === 'teacher') {
        const where = {
          role: 'teacher',
          classes: {
            some: { subjectId },
          },
        };

        [totalCount, usersList] = await Promise.all([
          prisma.user.count({ where }),
          prisma.user.findMany({
            where,
            orderBy: { createdAt: 'desc' },
            skip,
            take: limitPerPage,
          }),
        ]);
      } else {
        const where = {
          role: 'student',
          enrollments: {
            some: {
              class: { subjectId },
            },
          },
        };

        [totalCount, usersList] = await Promise.all([
          prisma.user.count({ where }),
          prisma.user.findMany({
            where,
            orderBy: { createdAt: 'desc' },
            skip,
            take: limitPerPage,
          }),
        ]);
      }

      return {
        data: usersList,
        pagination: {
          page: currentPage,
          limit: limitPerPage,
          total: totalCount,
          totalPages: Math.ceil(totalCount / limitPerPage),
        },
      };
    } catch (error) {
      console.error('GET /subjects/:id/users error:', error);
      throw new InternalServerErrorException('Failed to fetch subject users');
    }
  }
}
