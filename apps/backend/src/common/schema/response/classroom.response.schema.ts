import { createZodDto } from 'nestjs-zod';
import z from 'zod';
import { SubjectSchema } from '../classroom.schema.js';
import { dateTime } from '../../../lib/zod.date.parser.js';

export const PaginationSchema = z.object({
  page: z.number(),
  limit: z.number(),
  total: z.number(),
  totalPages: z.number(),
});

const responseFactory = <T extends z.ZodType>(
  data: T,
  pagination?: boolean,
) => {
  if (pagination) {
    return z.object({
      data: data,
      pagination: pagination,
    });
  }
  return z.object({
    data: data,
  });
};

export class AllSubjectsResponse extends createZodDto(
  responseFactory(
    z.array(
      SubjectSchema.pick({
        id: true,
        name: true,
        code: true,
        departmentId: true,
        description: true,
      }).extend({
        createdAt: dateTime(),
      }),
    ),
    true,
  ),
) {}
