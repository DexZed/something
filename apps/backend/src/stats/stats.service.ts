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
  // "latestClasses": [
  //           {
  //               "id": 7,
  //               "subjectId": 1,
  //               "teacherId": "xssWRhQSxTdVc1Mew9KVvFaUhBLaavST",
  //               "inviteCode": "q7xjs96",
  //               "name": "Programming Advanced - Section D",
  //               "price": "5000",
  //               "currency": "BDT",
  //               "bannerCldPubId": null,
  //               "bannerUrl": null,
  //               "capacity": 30,
  //               "description": "Advance Programming Concepts 5",
  //               "status": "active",
  //               "schedules": [
  //                   {
  //                       "endTime": "10:30",
  //                       "roomUrl": "https://meet.google.com/abc-defg-hij",
  //                       "location": "Room 402",
  //                       "dayOfWeek": "Monday",
  //                       "startTime": "09:00"
  //                   },
  //                   {
  //                       "endTime": "10:30",
  //                       "roomUrl": "https://meet.google.com/abc-defg-hij",
  //                       "location": "Room 402",
  //                       "dayOfWeek": "Wednesday",
  //                       "startTime": "09:00"
  //                   }
  //               ],
  //               "createdAt": "2026-09-23T10:50:20.802Z",
  //               "updatedAt": "2026-09-23T10:50:20.802Z"
  //           }
  async getLatest(limit: number = 5) {
    const limitPerPage = Math.max(1, limit);

    try {
      const [latestClasses, latestTeachers] = await Promise.all([
        prisma.class.findMany({
          take: limitPerPage,
          orderBy: { createdAt: 'desc' },
          select: {
            id: true,
            subjectId: true,
            teacherId: true,
            description: true,
            status: true,
            createdAt: true,
          },
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
