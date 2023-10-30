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

export const handleGetPost = async (req: Request, res: Response, next: NextFunction) => {
  const { requestPost: post } = req;
  try {
    res.status(200).json({ post });
  } catch (error) {
    next(error);
  }
};

export const handleCreatePost = async (req: Request, res: Response, next: NextFunction) => {
  const { requestUser, body: postFields } = req;
  try {
    const users = await PostModel.create(requestUser.id, postFields);
    res.status(200).json({ users });
  } catch (error) {
    next(error);
  }
};

export const handleUpdatePost = async (req: Request, res: Response, next: NextFunction) => {
  const { requestPost, body: postFields } = req;
  try {
    const users = await PostModel.update(requestPost.id, postFields);
    res.status(200).json({ users });
  } catch (error) {
    next(error);
  }
};

export const handleDeletePost = async (req: Request, res: Response, next: NextFunction) => {
  const { requestUser, requestPost } = req;
  try {
    const users = await PostModel.delete(requestUser.id, requestPost.id);
    res.status(200).json({ users });
  } catch (error) {
    next(error);
  }
};
