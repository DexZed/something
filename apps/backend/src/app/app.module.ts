import { Module } from '@nestjs/common';
import { AppController } from './app.controller.js';
import { AppService } from './app.service.js';
import { auth } from '../lib/auth.js';
import { AuthModule } from '@thallesp/nestjs-better-auth';
import { APP_INTERCEPTOR, APP_PIPE } from '@nestjs/core';
import { ZodSerializerInterceptor, ZodValidationPipe } from 'nestjs-zod';
import { ConfigModule } from '@nestjs/config';
import { validate } from '../config/env.validation.js';
import { DepartmentsModule } from '../departments/departments.module.js';
import { ClassesModule } from '../classes/classes.module.js';
import { EnrolmentsModule } from '../enrolments/enrolments.module.js';
import { PaymentsModule } from '../payments/payments.module.js';
import { StatsModule } from '../stats/stats.module.js';
import { SubjectsModule } from '../subjects/subjects.module.js';
import { UsersModule } from '../users/users.module.js';
import { TransformInterceptor } from '../lib/transform.interceptor.js';

@Module({
  imports: [
    AuthModule.forRoot({ auth }),
    SubjectsModule,
    ConfigModule.forRoot({
      isGlobal: true,
      validate,
    }),
    UsersModule,
    ClassesModule,
    DepartmentsModule,
    EnrolmentsModule,
    StatsModule,
    PaymentsModule,
  ],
  controllers: [AppController],
  providers: [
    AppService,
    {
      provide: APP_PIPE,
      useClass: ZodValidationPipe,
    },
    {
      provide: APP_INTERCEPTOR,
      useClass: TransformInterceptor,
    },
    {
      provide: APP_INTERCEPTOR,
      useClass: ZodSerializerInterceptor,
    },
  ],
})
export class AppModule {}
