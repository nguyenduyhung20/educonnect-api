import { Request, Response, NextFunction } from 'express';
import { produceUserEventMessage, UserEventMessageSchema } from '../services/recommend.service';

export const handleReceiveUserEvent = async (req: Request, res: Response, next: NextFunction) => {
  const { requestUser } = req;
  try {
    const input = {
      ...req.body,
      userId: requestUser.id.toString()
    };
    const validatedInput = UserEventMessageSchema.parse(input);

    await produceUserEventMessage({
      userId: requestUser.id.toString(),
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
