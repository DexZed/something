import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { prisma } from '../lib/prisma.js';

@Injectable()
export class DepartmentsService {
  // Get all departments with optional search and pagination
  async findAll(query: { search?: string; page?: string; limit?: string }) {
    const page = Math.max(1, Number(query.page) || 1);
    const limit = Math.max(1, Number(query.limit) || 10);
    const skip = (page - 1) * limit;

    const where: any = {};

    if (query.search) {
      where.OR = [
        { name: { contains: query.search, mode: 'insensitive' } },
        { code: { contains: query.search, mode: 'insensitive' } },
      ];
    }

    const [totalCount, departmentsList] = await Promise.all([
      prisma.department.count({ where }),
      prisma.department.findMany({
        where,
        include: {
          _count: {
            select: { subjects: true },
          },
        },
        orderBy: { createdAt: 'desc' },
        skip,
        take: limit,
      }),
    ]);

    // Map Prisma's _count object to match the original totalSubjects property
    const formattedData = departmentsList.map((dept) => ({
      ...dept,
      totalSubjects: dept._count.subjects,
      _count: undefined,
    }));

    return {
      data: formattedData,
      pagination: {
        page,
        limit,
        total: totalCount,
        totalPages: Math.ceil(totalCount / limit),
      },
    };
  }

  // Create a new department
  async create(dto: { code: string; name: string; description?: string }) {
    const createdDepartment = await prisma.department.create({
      data: dto,
      select: { id: true },
    });

    if (!createdDepartment) {
      throw new BadRequestException('Failed to create department');
    }

    return { data: createdDepartment };
  }

  // Get department details with totals counts
  async findOne(id: number) {
    if (!Number.isFinite(id)) {
      throw new BadRequestException('Invalid department id');
    }

    const department = await prisma.department.findUnique({
      where: { id },
    });

    if (!department) {
      throw new NotFoundException('Department not found');
    }

    const [subjectsCount, classesCount, enrolledStudentsCount] =
      await Promise.all([
        prisma.subject.count({ where: { departmentId: id } }),
        prisma.class.count({
          where: { subject: { departmentId: id } },
        }),
        prisma.user.count({
          where: {
            role: 'student',
            enrollments: {
              some: {
                class: {
                  subject: { departmentId: id },
                },
              },
            },
          },
        }),
      ]);

    return {
      data: {
        department,
        totals: {
          subjects: subjectsCount,
          classes: classesCount,
          enrolledStudents: enrolledStudentsCount,
        },
      },
    };
  }

  // List subjects in a department with pagination
  async findSubjects(id: number, query: { page?: string; limit?: string }) {
    if (!Number.isFinite(id)) {
      throw new BadRequestException('Invalid department id');
    }

    const page = Math.max(1, Number(query.page) || 1);
    const limit = Math.max(1, Number(query.limit) || 10);
    const skip = (page - 1) * limit;

    const [totalCount, subjectsList] = await Promise.all([
      prisma.subject.count({ where: { departmentId: id } }),
      prisma.subject.findMany({
        where: { departmentId: id },
        orderBy: { createdAt: 'desc' },
        skip,
        take: limit,
      }),
    ]);

    return {
      data: subjectsList,
      pagination: {
        page,
        limit,
        total: totalCount,
        totalPages: Math.ceil(totalCount / limit),
      },
    };
  }

  // List classes in a department with pagination
  async findClasses(id: number, query: { page?: string; limit?: string }) {
    if (!Number.isFinite(id)) {
      throw new BadRequestException('Invalid department id');
    }

    const page = Math.max(1, Number(query.page) || 1);
    const limit = Math.max(1, Number(query.limit) || 10);
    const skip = (page - 1) * limit;

    const where = { subject: { departmentId: id } };

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

  // List users in a department by role with pagination
  async findUsers(
    id: number,
    role: string,
    query: { page?: string; limit?: string },
  ) {
    if (!Number.isFinite(id)) {
      throw new BadRequestException('Invalid department id');
    }

    if (role !== 'teacher' && role !== 'student') {
      throw new BadRequestException('Invalid role');
    }

    const page = Math.max(1, Number(query.page) || 1);
    const limit = Math.max(1, Number(query.limit) || 10);
    const skip = (page - 1) * limit;

    const where: any = { role };

    if (role === 'teacher') {
      where.classes = {
        some: {
          subject: { departmentId: id },
        },
      };
    } else {
      where.enrollments = {
        some: {
          class: {
            subject: { departmentId: id },
          },
        },
      };
    }

    const [totalCount, usersList] = await Promise.all([
      prisma.user.count({ where }),
      prisma.user.findMany({
        where,
        orderBy: { createdAt: 'desc' },
        skip,
        take: limit,
      }),
    ]);

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
