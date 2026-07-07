import type { NextFunction, Request, Response } from "express";

import { env } from "../env";
import { HttpException, BadRequestException } from "./httpException";
import { Prisma } from "../../generated/prisma/client";



export function globalErrorHandler(
  err: Error,
  req: Request,
  res: Response,
  _: NextFunction,
) {
  let statusCode = 500;
  let message = "Internal server error";
  let details: any;

  if (err instanceof HttpException) {
    statusCode = err.status;
    message = err.message;

    if (err instanceof BadRequestException) {
      details = err.details;
    }
  }else if(err instanceof Prisma.PrismaClientValidationError) {
    statusCode = 422;
    details = err.message.replaceAll(/\n/g, " ");
  }
   else {
    console.error("💥 Unhandled Application Error:", err);
  }

  res.status(statusCode).json({
    success: false,
    status: statusCode,
    timeStamp: new Date().toISOString(),
    path: req.originalUrl,
    message,
    ...(details && { details }),
    ...(env.NODE_ENV === "development" && { stack: err.stack }),
  });
}
