import { NextFunction, Request, Response } from 'express';
import { UserModel } from '../models/user.model';
import { AppError } from '../config/AppError';

export const verifyUser = async (req: Request, res: Response, next: NextFunction) => {
  const { userId } = req.params;
  const userIdNum = parseInt(userId, 10);
  try {
    const user = await UserModel.getById(userIdNum);
    if (!user) {
      throw new AppError(404, 'NOT_FOUND');
    }
    req.requestUser = user;
    next();
  } catch (error) {
    next(error);
  }
};
