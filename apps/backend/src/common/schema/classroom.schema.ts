import z from 'zod';
import { createZodDto } from 'nestjs-zod';

// Enums
export const ClassStatusSchema = z.enum(['active', 'inactive', 'archived']);
export const PaymentStatusSchema = z.enum([
  'pending',
  'succeeded',
  'failed',
  'refunded',
]);

export const UserSchema = z.object({
  id: z.string(),
  name: z.string(),
  email: z.string(),
  emailVerified: z.boolean(),
  image: z.string().optional(),
  createdAt: z.date(),
  updatedAt: z.date(),
  role: z.string(),
  imageCldPubId: z.string().optional(),
  //   sessions: z.array(z.lazy(() => SessionSchema)),
  //   accounts: z.array(z.lazy(() => AccountSchema)),
  classes: z.array(z.lazy(() => ClassSchema)),
  enrollments: z.array(z.lazy(() => EnrollmentSchema)),
  payments: z.array(z.lazy(() => PaymentSchema)),
});

export type User = z.infer<typeof UserSchema>;
export class UserEntity extends createZodDto(UserSchema) {}
// export const SessionSchema = z.object({
//   id: z.string(),
//   expiresAt: z.date(),
//   token: z.string(),
//   createdAt: z.date(),
//   updatedAt: z.date(),
//   ipAddress: z.string().optional(),
//   userAgent: z.string().optional(),
//   userId: z.string(),
//   // user: relation to User
// });

// export type Session = z.infer<typeof SessionSchema>;

// export const AccountSchema = z.object({
//   id: z.string(),
//   accountId: z.string(),
//   providerId: z.string(),
//   userId: z.string(),
//   // user: relation to User
//   accessToken: z.string().optional(),
//   refreshToken: z.string().optional(),
//   idToken: z.string().optional(),
//   accessTokenExpiresAt: z.date().optional(),
//   refreshTokenExpiresAt: z.date().optional(),
//   scope: z.string().optional(),
//   password: z.string().optional(),
//   createdAt: z.date(),
//   updatedAt: z.date(),
// });

// export type Account = z.infer<typeof AccountSchema>;

// export const VerificationSchema = z.object({
//   id: z.string(),
//   identifier: z.string(),
//   value: z.string(),
//   expiresAt: z.date(),
//   createdAt: z.date(),
//   updatedAt: z.date(),
// });

// export type Verification = z.infer<typeof VerificationSchema>;

export const DepartmentSchema = z.object({
  id: z.number(),
  code: z.string(),
  name: z.string(),
  description: z.string().optional(),
  createdAt: z.date(),
  updatedAt: z.date(),
  subjects: z.array(z.lazy(() => SubjectSchema)),
});

export type Department = z.infer<typeof DepartmentSchema>;
export class DepartmentEntity extends createZodDto(DepartmentSchema) {}

export const SubjectSchema = z.object({
  id: z.number(),
  departmentId: z.number(),
  name: z.string(),
  code: z.string(),
  description: z.string().optional(),
  createdAt: z.date(),
  updatedAt: z.date(),
  // department: relation to Department
  classes: z.array(z.lazy(() => ClassSchema)),
});

export type Subject = z.infer<typeof SubjectSchema>;
export class SubjectEntity extends createZodDto(SubjectSchema) {}

export const ClassSchema = z.object({
  id: z.number(),
  subjectId: z.number(),
  teacherId: z.string(),
  inviteCode: z.string(),
  name: z.string(),
  price: z.number(),
  currency: z.string(),
  bannerCldPubId: z.string().optional(),
  bannerUrl: z.string().optional(),
  capacity: z.number(),
  description: z.string().optional(),
  status: z.lazy(() => ClassStatusSchema),
  schedules: z.record(z.string(), z.string()).optional(),
  createdAt: z.date(),
  updatedAt: z.date(),
  // subject: relation to Subject
  // teacher: relation to User
  enrollments: z.array(z.lazy(() => EnrollmentSchema)),
  payments: z.array(z.lazy(() => PaymentSchema)),
});

export type Class = z.infer<typeof ClassSchema>;
export class ClassEntity extends createZodDto(ClassSchema) {}

export const PaymentSchema = z.object({
  id: z.number(),
  userId: z.string(),
  classId: z.number(),
  amount: z.number(),
  currency: z.string(),
  status: z.lazy(() => PaymentStatusSchema),
  stripePaymentIntentId: z.string().optional(),
  stripeCheckoutSessionId: z.string().optional(),
  createdAt: z.date(),
  updatedAt: z.date(),
  // user: relation to User
  // class: relation to Class
  enrollment: z.lazy(() => EnrollmentSchema).optional(),
});

export type Payment = z.infer<typeof PaymentSchema>;
export class PaymentEntity extends createZodDto(PaymentSchema) {}
export const EnrollmentSchema = z.object({
  id: z.number(),
  studentId: z.string(),
  classId: z.number(),
  paymentId: z.number().optional(),
  createdAt: z.date(),
  updatedAt: z.date(),
  // student: relation to User
  // class: relation to Class
  // payment: relation to Payment
});

export type Enrollment = z.infer<typeof EnrollmentSchema>;
export class EnrollmentEntity extends createZodDto(EnrollmentSchema) {}
