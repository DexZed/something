import type { NextFunction, Request, Response } from "express";

type AsyncRouteHandler = (
  req: Request,
  res: Response,
  next: NextFunction,
) => Promise<any>;

export const asyncWrapper = (fn: AsyncRouteHandler) => {
  return (req: Request, res: Response, next: NextFunction) => {
    return Promise.try(() => fn(req, res, next)).catch(next); 
  };
};