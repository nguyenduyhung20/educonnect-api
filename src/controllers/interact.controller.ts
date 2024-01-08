import { NextFunction, Request, Response } from 'express';
import { InteractModel } from '../models/interact.model';
import { producer } from '../services/kafka-client';

export const handleGetPostInteract = async (req: Request, res: Response, next: NextFunction) => {
  const { requestPost } = req;
  try {
    const users = await InteractModel.getByPostId(requestPost.id);
    res.status(200).json({ data: users });
  } catch (error) {
    next(error);
  }
};

export const handleCreatePostInteract = async (req: Request, res: Response, next: NextFunction) => {
  const { requestUser, requestPost, body: postFields } = req;
  try {
    const users = await InteractModel.create(postFields, requestUser.id, requestPost.id);
    const messages = [
      {
        key: 'interact',
        value: JSON.stringify({
          type: postFields.type,
          user_id: requestUser.id,
          post_id: users.post_id,
        })
      }
    ];
    producer('interact-topic', messages, 'kafka-producer-interact');
    res.status(200).json({ data: users });
  } catch (error) {
    next(error);
  }
};

export const handleUpdatePostInteract = async (req: Request, res: Response, next: NextFunction) => {
  const { requestUser, requestPost, body: postFields } = req;
  try {
    const users = await InteractModel.update(requestUser.id, requestPost.id, postFields);
    res.status(200).json({ data: users });
  } catch (error) {
    next(error);
  }
};

export const handleDeletePostInteract = async (req: Request, res: Response, next: NextFunction) => {
  const { requestUser, requestPost } = req;
  try {
    const users = await InteractModel.delete(requestUser.id, requestPost.id);
    res.status(200).json({ data: users });
  } catch (error) {
    next(error);
  }
};
