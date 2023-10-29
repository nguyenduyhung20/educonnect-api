import { NextFunction, Request, Response } from 'express';
import { PostModel } from '../models/post.model';
import { AppError } from '../config/AppError';

export const verifyPost = async (req: Request, res: Response, next: NextFunction) => {
  const { postUuid } = req.params;
  try {
    const post = await PostModel.getByUuid(postUuid);
    if (!post) {
      throw new AppError(404, 'NOT_FOUND');
    }
    req.requestPost = post;
    next();
  } catch (error) {
    next(error);
  }
};
