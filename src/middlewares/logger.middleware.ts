import type { NextFunction, Request, Response } from 'express';

export const loggerMiddleware = (
  req: Request,
  _res: Response,
  next: NextFunction,
): void => {
  const time = new Date().toISOString();
  console.log(`[${time}] ${req.method} ${req.originalUrl}`);
  next();
};
