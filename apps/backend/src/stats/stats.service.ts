import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { prisma } from '../lib/prisma.js';

@Injectable()
export class StatsService {
  /**
   * Overview counts for core entities
   */
  async getOverview() {
    try {
      const [
        usersCount,
        teachersCount,
        adminsCount,
        subjectsCount,
        departmentsCount,
        classesCount,
      ] = await Promise.all([
        prisma.user.count(),
        prisma.user.count({ where: { role: 'teacher' } }),
        prisma.user.count({ where: { role: 'admin' } }),
        prisma.subject.count(),
        prisma.department.count(),
        prisma.class.count(),
      ]);

      return {
        users: usersCount,
        teachers: teachersCount,
        admins: adminsCount,
        subjects: subjectsCount,
        departments: departmentsCount,
        classes: classesCount,
      };
    } catch (error) {
      console.error('Error fetching overview stats', error);
      throw new InternalServerErrorException('Failed to fetch overview stats');
    }
  }

  /**
   * Latest activity summaries with relations and limit
   */
  async getLatest(limit: number = 5) {
    const limitPerPage = Math.max(1, limit);

    try {
      const [latestClasses, latestTeachers] = await Promise.all([
        prisma.class.findMany({
          take: limitPerPage,
          orderBy: { createdAt: 'desc' },
          // include: {
          //   subject: true,
          //   teacher: true,
          // },
        }),
        prisma.user.findMany({
          where: { role: 'teacher' },
          take: limitPerPage,
          orderBy: { createdAt: 'desc' },
        }),
      ]);

      return {
        latestClasses,
        latestTeachers,
      };
    } catch (error) {
      console.error('Error fetching latest stats', error);
      throw new InternalServerErrorException('Failed to fetch latest stats');
    }
  }

  /**
   * Aggregates for charts (Group By and Counts)
   */
  async getCharts() {
    try {
      // 1. Users grouped by role
      const usersByRoleRaw = await prisma.user.groupBy({
        by: ['role'],
        _count: {
          _all: true,
        },
      });

      const usersByRole = usersByRoleRaw.map((item) => ({
        role: item.role,
        total: item._count._all,
      }));

      // 2. Subjects by department (including departments with 0 subjects)
      const departmentsWithSubjects = await prisma.department.findMany({
        include: {
          subjects: {
            select: { id: true },
          },
        },
      });

      const subjectsByDepartment = departmentsWithSubjects.map((dept) => ({
        departmentId: dept.id,
        departmentName: dept.name,
        totalSubjects: dept.subjects.length,
      }));

      // 3. Classes by subject (including subjects with 0 classes)
      const subjectsWithClasses = await prisma.subject.findMany({
        include: {
          classes: {
            select: { id: true },
          },
        },
      });

      const classesBySubject = subjectsWithClasses.map((subj) => ({
        subjectId: subj.id,
        subjectName: subj.name,
        totalClasses: subj.classes.length,
      }));

      return {
        usersByRole,
        subjectsByDepartment,
        classesBySubject,
      };
    } catch (error) {
      console.error('Error fetching chart stats', error);
      throw new InternalServerErrorException('Failed to fetch chart stats');
    }
  }
}
