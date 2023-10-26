import { NextFunction, Request, Response } from 'express';
import { UserRepository } from '../models/user.model';
import { AppError } from '../config/AppError';

export const verifyUser = async (req: Request, res: Response, next: NextFunction) => {
  const { userUuid } = req.params;
  try {
    const user = await UserRepository.getByUuid(userUuid);
    if (!user) {
      throw new AppError(404, 'NOT_FOUND');
    }
    req.requestUser = user;
    next();
  } catch (error) {
    next(error);
  }
};
