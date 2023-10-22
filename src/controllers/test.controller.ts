import { NextFunction, Request, Response } from 'express';
import { db } from '../databases/kysely';
import { AppError } from '../config/AppError';

export const handleGetAllUsers = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const users = await db.selectFrom('user').select('name').execute();
    res.status(200).json({ users });
  } catch (error) {
    next(error);
  }
};

export const handleError = async (req: Request, res: Response, next: NextFunction) => {
  try {
    throw new AppError(418, 'Hello teapot');
  } catch (error) {
    next(error);
  }
};
