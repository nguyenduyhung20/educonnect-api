import { NextFunction, Request, Response } from 'express';
import { ExploreModel } from '../models/explore.model';

export const handleGetExplorePost = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { requestUser } = req;
    const posts = await ExploreModel.getExplorePost(requestUser.id);
    res.status(200).json({ data: posts });
  } catch (error) {
    next(error);
  }
};
