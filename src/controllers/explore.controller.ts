import { NextFunction, Request, Response } from 'express';
import { ExploreModel } from '../models/explore.model';
import { UserModel } from '../models/user.model';

export const handleGetExplorePost = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const posts = await ExploreModel.getExplorePost();
    res.status(200).json({ data: posts });
  } catch (error) {
    next(error);
  }
};

export const handleGetPublicExplorePost = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const posts = await ExploreModel.getPublicExplorePost();
    res.status(200).json({ data: posts });
  } catch (error) {
    next(error);
  }
};

export const handleGetPublicMostUserFollower = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const users = await UserModel.getUserMostFollower();
    res.status(200).json({ data: users });
  } catch (error) {
    next(error);
  }
};
