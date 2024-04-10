import { NextFunction, Request, Response } from 'express';
import { CustomError } from '../config/AppError';
import { getPostsByListId } from '../models/post.model';

export const handleTest = async (req: Request, res: Response, next: NextFunction) => {
  try {
    // const users = await db.selectFrom('user').select('name').execute();
    const data = await getPostsByListId({ postIdList: [1, 2, 3], userIdRequesting: 2, isComment: true });
    res.status(200).json({ data });
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
