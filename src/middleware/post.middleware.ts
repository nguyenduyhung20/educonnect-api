import { NextFunction, Request, Response } from 'express';
import { AppError } from '../config/AppError';
import { PostService } from '../services/post.service';

export const verifyPost = async (req: Request, res: Response, next: NextFunction) => {
  const { postId } = req.params;
  const { requestUser } = req;
  try {
    const post = await PostService.getPost({ postId: parseInt(postId, 10), userIdRequesting: requestUser.id });
    if (!post) {
      throw new AppError(404, 'NOT_FOUND');
    }
    req.requestPost = post;
    next();
  } catch (error) {
    next(error);
  }
};
