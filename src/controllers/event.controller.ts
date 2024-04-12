import { Request, Response, NextFunction } from 'express';
import { IUserEventMessage, produceUserEventMessage, UserEventMessageSchema } from '../services/recommend.service';
import prisma from '../databases/client';
import { AppError } from '../config/AppError';

type ViewEventPayload = {
  postId: number;
  interactionType: 'view';
  timestamp: string;
};
export const handleReceiveUserEvent = async (req: Request, res: Response, next: NextFunction) => {
  const { requestUser } = req;
  const payload: ViewEventPayload = req.body;
  try {
    const post = await prisma.post.findUnique({
      where: {
        id: payload.postId
      }
    });
    if (!post) {
      throw new AppError(404, 'NOT_FOUND');
    }
    const postTopic = await prisma.post_topic.findMany({
      where: {
        post_id: post.id
      }
    });
    const input: IUserEventMessage = {
      ...payload,
      postId: post.id,
      postTopic: postTopic.map((item) => item.topic_id),
      userId: requestUser.id
    };
    const validatedInput = UserEventMessageSchema.parse(input);

    await produceUserEventMessage({
      userId: requestUser.id,
      postId: validatedInput.postId,
      postTopic: validatedInput.postTopic,
      interactionType: validatedInput.interactionType,
      timestamp: validatedInput.timestamp,
      metadata: validatedInput.metadata
    });

    return res.status(200).json({ success: true });
  } catch (error) {
    next(error);
  }
};
