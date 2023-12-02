import { NextFunction, Request, Response } from 'express';
import { GroupModel } from '../models/group.model';
import { AppError } from '../config/AppError';

export const verifyGroup = async (req: Request, res: Response, next: NextFunction) => {
  const { groupUuid } = req.params;
  try {
    const group = await GroupModel.getByUuid(groupUuid);
    if (!group) {
      throw new AppError(404, 'NOT_FOUND');
    }
    req.requestGroup = group;
    next();
  } catch (error) {
    next(error);
  }
};
