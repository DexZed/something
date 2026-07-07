import { ReasonPhrases, StatusCodes } from "http-status-codes";
import { asyncWrapper } from "../../lib/asyncWrapper";
import type { Request, Response } from "express";

export const register = asyncWrapper(
  async (req: Request, res: Response) => {

    res.status(StatusCodes.OK).json({
    message: `From ${req.path} `,
  });
  },
);
export const login = asyncWrapper(
  async (req: Request, res: Response) => {

    res.status(StatusCodes.OK).json({
    message: `From ${req.path} `,
  });
  },
);
export const profile = asyncWrapper(
  async (req: Request, res: Response) => {

    res.status(StatusCodes.OK).json({
    message: `From ${req.path} `,
  });
  },
);