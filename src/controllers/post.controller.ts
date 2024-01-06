import { NextFunction, Request, Response } from 'express';
import { PostModel } from '../models/post.model';

export const handleGetUserPost = async (req: Request, res: Response, next: NextFunction) => {
  const { requestUser } = req;
  const { detail } = req.query;
  try {
    if (detail === 'true') {
      const result = await PostModel.getUserPostWithComment(requestUser.id);

      return res.status(200).json({ data: result });
    } else {
      const result = await PostModel.getUserPost(requestUser.id);
      return res.status(200).json({ data: result });
    }
  } catch (error) {
    next(error);
  }
};

export const handleGetGroupPosts = async (req: Request, res: Response, next: NextFunction) => {
  const { requestGroup } = req;
  try {
    const result = await PostModel.getGroupPosts(requestGroup.id);

    res.status(200).json({ data: result });
  } catch (error) {
    next(error);
  }
};

export const handleGetPost = async (req: Request, res: Response, next: NextFunction) => {
  const { requestPost: post } = req;
  try {
    return res.status(200).json({ data: post });
  } catch (error) {
    next(error);
  }
};

export const handleCreatePost = async (req: Request, res: Response, next: NextFunction) => {
  const { requestUser, body: postFields } = req;
  try {
    const post = await PostModel.create(requestUser.id, postFields);
    res.status(200).json({ data: post });
  } catch (error) {
    next(error);
  }
};

export const handleUpdatePost = async (req: Request, res: Response, next: NextFunction) => {
  const { requestPost, body: postFields } = req;
  try {
    const post = await PostModel.update(requestPost.id, postFields);
    res.status(200).json({ data: post });
  } catch (error) {
    next(error);
  }
};

export const handleDeletePost = async (req: Request, res: Response, next: NextFunction) => {
  const { requestUser, requestPost } = req;
  try {
    const post = await PostModel.delete(requestUser.id, requestPost.id);
    res.status(200).json({ data: post });
  } catch (error) {
    next(error);
  }
};

export const handleCreateComment = async (req: Request, res: Response, next: NextFunction) => {
  const { requestUser, requestPost, body: postFields } = req;
  try {
    const post = await PostModel.createComment(requestUser.id, requestPost.id, postFields);
    res.status(200).json({ data: post });
  } catch (error) {
    next(error);
  }
};
