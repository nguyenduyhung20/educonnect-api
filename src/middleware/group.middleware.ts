import { NextFunction, Request, Response } from 'express';
import { GroupModel } from '../models/group.model';
import { AppError } from '../config/AppError';

export const verifyGroup = async (req: Request, res: Response, next: NextFunction) => {
  const { groupId } = req.params;
  try {
    const group = await GroupModel.getById(parseInt(groupId, 10));
    if (!group) {
      throw new AppError(404, 'NOT_FOUND');
    }
    req.requestGroup = group;
    next();
  } catch (error) {
    next(error);
  }
};
