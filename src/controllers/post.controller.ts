import { NextFunction, Request, Response } from 'express';
import { PostModel } from '../models/post.model';

export const handleGetUserPost = async (req: Request, res: Response, next: NextFunction) => {
  const { requestUser } = req;
  try {
    const users = await PostModel.getUserPost(requestUser.id);
    res.status(200).json({ users });
  } catch (error) {
    next(error);
  }
};
