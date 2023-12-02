import { NextFunction, Request, Response } from 'express';
import { UserModel } from '../models/user.model';
import { AppError } from '../config/AppError';

export const verifyFollowed = async (req: Request, res: Response, next: NextFunction) => {
  const { followedUuid } = req.params;
  try {
    const user = await UserModel.getByUuid(followedUuid);
    if (!user) {
      throw new AppError(404, 'NOT_FOUND');
    }
    req.requestFollowed = user;
    next();
  } catch (error) {
    next(error);
  }
};
