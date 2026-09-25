import { Injectable, NotFoundException } from '@nestjs/common';
import { prisma } from '../lib/prisma.js';

@Injectable()
export class UsersService {
  async findAll(params: {
    search?: string;
    role?: string;
    page: number;
    limit: number;
  }) {
    const { search, role, page, limit } = params;
    const currentPage = Math.max(1, page);
    const limitPerPage = Math.max(1, limit);
    const skip = (currentPage - 1) * limitPerPage;

    const where: any = {};

    if (search) {
      where.OR = [
        { name: { contains: search, mode: 'insensitive' } },
        { email: { contains: search, mode: 'insensitive' } },
      ];
    }

    if (role) {
      where.role = role;
    }

    const [totalCount, usersList] = await Promise.all([
      prisma.user.count({ where }),
      prisma.user.findMany({
        where,
        orderBy: { createdAt: 'desc' },
        skip,
        take: limitPerPage,
      }),
    ]);

    return {
      data: usersList,
      pagination: {
        page: currentPage,
        limit: limitPerPage,
        total: totalCount,
        totalPages: Math.ceil(totalCount / limitPerPage),
      },
    };
  }

  async findOne(id: string) {
    const userRecord = await prisma.user.findUnique({
      where: { id },
    });

    if (!userRecord) {
      throw new NotFoundException('User not found');
    }

    return { data: userRecord };
  }

  async findUserDepartments(id: string, page: number, limit: number) {
    const userRecord = await prisma.user.findUnique({
      where: { id },
      select: { id: true, role: true },
    });

    if (!userRecord) {
      throw new NotFoundException('User not found');
    }

    if (userRecord.role !== 'teacher' && userRecord.role !== 'student') {
      return {
        data: [],
        pagination: { page: 1, limit: 0, total: 0, totalPages: 0 },
      };
    }

    const currentPage = Math.max(1, page);
    const limitPerPage = Math.max(1, limit);
    const skip = (currentPage - 1) * limitPerPage;

    const departmentWhere: any = {};
    if (userRecord.role === 'teacher') {
      departmentWhere.subjects = {
        some: {
          classes: {
            some: { teacherId: id },
          },
        },
      };
    } else {
      departmentWhere.subjects = {
        some: {
          classes: {
            some: {
              enrollments: {
                some: { studentId: id },
              },
            },
          },
        },
      };
    }

    const [totalCount, departmentsList] = await Promise.all([
      prisma.department.count({ where: departmentWhere }),
      prisma.department.findMany({
        where: departmentWhere,
        orderBy: { createdAt: 'desc' },
        skip,
        take: limitPerPage,
      }),
    ]);

    return {
      data: departmentsList,
      pagination: {
        page: currentPage,
        limit: limitPerPage,
        total: totalCount,
        totalPages: Math.ceil(totalCount / limitPerPage),
      },
    };
  }

  async findUserSubjects(id: string, page: number, limit: number) {
    const userRecord = await prisma.user.findUnique({
      where: { id },
      select: { id: true, role: true },
    });

    if (!userRecord) {
      throw new NotFoundException('User not found');
    }

    if (userRecord.role !== 'teacher' && userRecord.role !== 'student') {
      return {
        data: [],
        pagination: { page: 1, limit: 0, total: 0, totalPages: 0 },
      };
    }

    const currentPage = Math.max(1, page);
    const limitPerPage = Math.max(1, limit);
    const skip = (currentPage - 1) * limitPerPage;

    const subjectWhere: any = {};
    if (userRecord.role === 'teacher') {
      subjectWhere.classes = {
        some: { teacherId: id },
      };
    } else {
      subjectWhere.classes = {
        some: {
          enrollments: {
            some: { studentId: id },
          },
        },
      };
    }

    const [totalCount, subjectsList] = await Promise.all([
      prisma.subject.count({ where: subjectWhere }),
      prisma.subject.findMany({
        where: subjectWhere,
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
  }
}
