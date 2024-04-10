import { NextFunction, Request, Response } from 'express';
import { CustomError } from '../config/AppError';
import { getRecommendPosts } from '../services/recommend.service';

export const handleTest = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const postIdList = [1, 2, 3];
    // const users = await db.selectFrom('user').select('name').execute();
    const data = await getRecommendPosts({ userId: 2 });
    return res.status(200).json({ data: data });
  } catch (error) {
    next(error);
  }
};

export const handleError = async (req: Request, res: Response, next: NextFunction) => {
  try {
    throw new CustomError(418, 'Hello teapot');
  } catch (error) {
    next(error);
  }
};
