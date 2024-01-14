import { NextFunction, Request, Response } from 'express';
import { InteractModel } from '../models/interact.model';
import { producer } from '../services/kafka-client';
import { NotificationModel } from '../models/notification.model';

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

    const action = postFields.action;
    if (action != 'dislike') {
      const content = `${postFields.info.senderName} đã ${postFields.type} ${
        postFields.info.itemType == 'post' ? 'bài viết' : 'bình luận'
      } của bạn.`;
      await NotificationModel.create({
        userId: postFields.info.receiverID,
        message: content
      });
      const messages = [
        {
          key: 'notification',
          value: JSON.stringify({
            senderInfo: { id: requestUser.id, avatar: postFields.info.senderAvatar },
            receiverID: postFields.info.receiverID,
            content: content,
            postId: postFields.info.postID
          })
        }
      ];
      producer('notification-topic', messages, 'kafka-producer-notification');
    }

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
