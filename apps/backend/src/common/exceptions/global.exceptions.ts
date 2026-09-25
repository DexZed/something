import {
  ExceptionFilter,
  Catch,
  ArgumentsHost,
  HttpException,
  HttpStatus,
} from '@nestjs/common';
import { HttpAdapterHost } from '@nestjs/core';
import { Prisma } from '../../generated/prisma/client.js';
import { ZodError } from 'zod';

@Catch()
export class CatchEverythingFilter implements ExceptionFilter {
  constructor(private readonly httpAdapterHost: HttpAdapterHost) {}

  catch(exception: unknown, host: ArgumentsHost): void {
    const { httpAdapter } = this.httpAdapterHost;
    let httpStatus;
    let message;
    const ctx = host.switchToHttp();
    const request = ctx.getRequest();
    console.log('--- Incoming Payload Causing Error ---', request.body);
    if (exception instanceof HttpException) {
      httpStatus = exception.getStatus();
      const exceptionResponse = exception.getResponse();

      // Extracts detailed validation errors if provided by ValidationPipe
      message = {
        type: 'HttpException',
        error:
          typeof exceptionResponse === 'object' &&
          exceptionResponse !== null &&
          'error' in exceptionResponse
            ? (exceptionResponse as any).error
            : exception.message,
        details:
          typeof exceptionResponse === 'object' &&
          exceptionResponse !== null &&
          'message' in exceptionResponse
            ? (exceptionResponse as any).message
            : exception.message,
        cause: exception.cause,
      };
    } else if (exception instanceof Prisma.PrismaClientKnownRequestError) {
      httpStatus = HttpStatus.BAD_REQUEST;
      message = {
        type: 'PrismaClientKnownRequestError',
        meta: exception.meta,
        code: exception.code,
        message: exception.message,
        cause: exception.cause,
      };
    } else if (exception instanceof ZodError) {
      httpStatus = HttpStatus.BAD_REQUEST;
      message = {
        type: 'ZodError',
        error: exception.name,
        cause: exception.cause,
      };
    } else if (exception instanceof Error) {
      httpStatus = HttpStatus.BAD_REQUEST;
      message = {
        type: 'Error',
        error: exception.message,
        cause: exception.cause,
      };
    } else {
      httpStatus = HttpStatus.INTERNAL_SERVER_ERROR;
      message = 'Internal Server Error';
    }

    const responseBody = {
      status: httpStatus,
      message,
      timestamp: new Date().toISOString(),
      path: httpAdapter.getRequestUrl(ctx.getRequest()),
      stack_trace: getStackTrace(exception),
    };

    httpAdapter.reply(ctx.getResponse(), responseBody, httpStatus);
  }
}

function getStackTrace(exception: unknown): string | undefined {
  if (exception instanceof Error) {
    return exception.stack;
  }
  return String(exception);
}
