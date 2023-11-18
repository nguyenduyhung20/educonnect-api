import { NextFunction, Request, Response } from 'express';
import { PostModel, mapPost } from '../models/post.model';
import { AppError } from '../config/AppError';

export const handleGetUserPost = async (req: Request, res: Response, next: NextFunction) => {
  const { requestUser } = req;
  try {
    const result = await PostModel.getUserPost(requestUser.id);

    if (!result) {
      throw new AppError(404, 'NOT_FOUND');
    }

    const mappedResult = result.post.map((post) => mapPost(post));

    res.status(200).json({ posts: mappedResult });
  } catch (error) {
    next(error);
  }
};

export const handleGetGroupPosts = async (req: Request, res: Response, next: NextFunction) => {
  const { requestGroup } = req;
  try {
    const result = await PostModel.getGroupPosts(requestGroup.id);

    if (!result) {
      throw new AppError(404, 'NOT_FOUND');
    }

    const mappedResult = result.post.map((post) => mapPost(post));

    res.status(200).json({ posts: mappedResult });
  } catch (error) {
    next(error);
  }
};

export const handleGetPost = async (req: Request, res: Response, next: NextFunction) => {
  const { requestPost: post } = req;
  try {
    const mappedPost = mapPost(post);

    res.status(200).json({ post: mappedPost });
  } catch (error) {
    next(error);
  }
};

export const handleCreatePost = async (req: Request, res: Response, next: NextFunction) => {
  const { requestUser, body: postFields } = req;
  try {
    const post = await PostModel.create(requestUser.id, postFields);
    res.status(200).json({ post });
  } catch (error) {
    next(error);
  }
};

export const handleUpdatePost = async (req: Request, res: Response, next: NextFunction) => {
  const { requestPost, body: postFields } = req;
  try {
    const post = await PostModel.update(requestPost.id, postFields);
    res.status(200).json({ post });
  } catch (error) {
    next(error);
  }
};

export const handleDeletePost = async (req: Request, res: Response, next: NextFunction) => {
  const { requestUser, requestPost } = req;
  try {
    const post = await PostModel.delete(requestUser.id, requestPost.id);
    res.status(200).json({ post });
  } catch (error) {
    next(error);
  }
};
