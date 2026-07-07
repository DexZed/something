import { ReasonPhrases, StatusCodes } from "http-status-codes";
import { asyncWrapper } from "../../lib/asyncWrapper";
import type { Request, Response } from "express";

export const index = asyncWrapper(async (_: Request, res: Response) => {
  if (Math.random() < 0.5) {
    throw new Error("Random error occurred");
  }

  res.status(StatusCodes.OK).json({
    message: "Working",
  });
});
export const getServices = asyncWrapper(async (req: Request, res: Response) => {
  res.status(StatusCodes.OK).json({
    message: `From ${req.path} `,
  });
});
export const getTechnicians = asyncWrapper(
  async (req: Request, res: Response) => {
    res.status(StatusCodes.OK).json({
      message: `From ${req.path} `,
    });
  },
);
export const getTechniciansById = asyncWrapper(
  async (req: Request, res: Response) => {
    res.status(StatusCodes.OK).json({
      message: `From ${req.path} `,
    });
  },
);
export const getCategories = asyncWrapper(
  async (req: Request, res: Response) => {
    res.status(StatusCodes.OK).json({
      message: `From ${req.path} `,
    });
  },
);
