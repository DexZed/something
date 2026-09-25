import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { prisma } from '../lib/prisma.js';
import { Prisma } from '../generated/prisma/client.js';

@Injectable()
export class ClassesService {
  async findAll(query: {
    search?: string;
    subject?: string;
    teacher?: string;
    page?: string;
    limit?: string;
  }) {
    const page = Math.max(1, Number(query.page) || 1);
    const limit = Math.max(1, Number(query.limit) || 10);
    const skip = (page - 1) * limit;

    const where: any = {};

    if (query.search) {
      where.OR = [
        { name: { contains: query.search, mode: 'insensitive' } },
        { inviteCode: { contains: query.search, mode: 'insensitive' } },
      ];
    }

    if (query.subject) {
      where.subject = {
        name: { contains: query.subject, mode: 'insensitive' },
      };
    }

    if (query.teacher) {
      where.teacher = {
        name: { contains: query.teacher, mode: 'insensitive' },
      };
    }

    const [totalCount, classesList] = await Promise.all([
      prisma.class.count({ where }),
      prisma.class.findMany({
        where,
        include: {
          subject: true,
          teacher: true,
        },
        orderBy: { createdAt: 'desc' },
        skip,
        take: limit,
      }),
    ]);

    return {
      data: classesList,
      pagination: {
        page,
        limit,
        total: totalCount,
        totalPages: Math.ceil(totalCount / limit),
      },
    };
  }

  // Create a new class
  async create(dto: Prisma.ClassCreateInput) {
    const inviteCode = Math.random().toString(36).substring(2, 9);

    const createdClass = await prisma.class.create({
      data: {
        ...dto,
        inviteCode,
        schedules: (dto.schedules ?? []) as string[], // matches default empty array if JSON/List
      },
      select: { id: true },
    });

    if (!createdClass) {
      throw new BadRequestException('Failed to create class');
    }

    return { data: createdClass };
  }

  // Get class details by ID with nested relations
  async findOne(id: number) {
    if (!Number.isFinite(id)) {
      throw new BadRequestException('Invalid class id');
    }

    const classDetails = await prisma.class.findUnique({
      where: { id },
      include: {
        subject: {
          include: {
            department: true,
          },
        },
        teacher: true,
      },
    });

    if (!classDetails) {
      throw new NotFoundException('Class not found');
    }

    return { data: classDetails };
  }

  // List users in a class by role with pagination
  async findUsers(
    id: number,
    role: string,
    query: { page?: string; limit?: string },
  ) {
    if (!Number.isFinite(id)) {
      throw new BadRequestException('Invalid class id');
    }

    if (role !== 'teacher' && role !== 'student') {
      throw new BadRequestException('Invalid role');
    }

    const page = Math.max(1, Number(query.page) || 1);
    const limit = Math.max(1, Number(query.limit) || 10);
    const skip = (page - 1) * limit;

    let usersList = [];
    let totalCount = 0;

    if (role === 'teacher') {
      // Assuming a relation where classes point to a teacher or vice-versa
      const classRecord = await prisma.class.findUnique({
        where: { id },
        include: { teacher: true },
      });

      usersList = classRecord?.teacher ? [classRecord.teacher] : [];
      totalCount = usersList.length;
    } else {
      // Students via enrollments relation
      const [count, enrollments] = await Promise.all([
        prisma.enrollment.count({ where: { classId: id } }),
        prisma.enrollment.findMany({
          where: { classId: id },
          include: { student: true },
          orderBy: { student: { createdAt: 'desc' } },
          skip,
          take: limit,
        }),
      ]);

      totalCount = count;
      usersList = enrollments.map((e) => e.student);
    }

    return {
      data: usersList,
      pagination: {
        page,
        limit,
        total: totalCount,
        totalPages: Math.ceil(totalCount / limit),
      },
    };
  }
}
