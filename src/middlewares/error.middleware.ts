import type { NextFunction, Request, Response } from 'express';
import { AppError } from '../utils/AppError.js';

export const errorMiddleware = (
  error: unknown,
  _req: Request,
  res: Response,
  _next: NextFunction,
): void => {
  if (error instanceof AppError) {
    res.status(error.statusCode).json({
      success: false,
      message: error.message,
    });
    return;
  }

  console.error(error);

  res.status(500).json({
    success: false,
    message: 'Lỗi hệ thống',
  });
};
