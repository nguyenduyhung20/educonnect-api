import { NextFunction, Request, Response } from 'express';
import { UserModel } from '../models/user.model';
import { AppError } from '../config/AppError';
import { GroupModel } from '../models/group.model';

export const verifyUser = async (req: Request, res: Response, next: NextFunction) => {
  const { userId } = req.body;
  try {
    const user = await UserModel.getById(parseInt(userId, 10));
    if (!user) {
      throw new AppError(404, 'NOT_FOUND');
    }
    req.requestUser = user;
    next();
  } catch (error) {
    next(error);
  }
};

export const verifyParent = (req: Request, res: Response, next: NextFunction) => {
  try {
    if (req.body.role != 'parent') {
      throw new AppError(404, 'NOT_FOUND');
    }
    next();
  } catch (error) {
    next(error);
  }
};

export const verifyAdmin = async (req: Request, res: Response, next: NextFunction) => {
  try {
    if (req.body.role != 'admin') {
      throw new AppError(404, 'NOT_FOUND');
    }
    const { userId } = req.body;
    const admin = await UserModel.getAdminById(parseInt(userId, 10));
    req.body.schoolId = admin?.school_id;
    next();
  } catch (error) {
    next(error);
  }
};

export const verifyTeacher = (req: Request, res: Response, next: NextFunction) => {
  try {
    if (req.body.role != 'teacher') {
      throw new AppError(404, 'NOT_FOUND');
    }
    next();
  } catch (error) {
    next(error);
  }
};

export const verifyAdminGroup = async (req: Request, res: Response, next: NextFunction) => {
  const { userId, groupId } = req.params;
  try {
    const result = await GroupModel.checkJoinGroup(parseInt(groupId, 10), parseInt(userId, 10));
    if (result?.role != 'admin') {
      res.status(401).json({
        message: 'unauthorization'
      });
      throw new AppError(401, 'UN_AUTHORIZATION');
    }
    next();
  } catch (error) {
    next(error);
  }
};
