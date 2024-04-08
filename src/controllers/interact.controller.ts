import { NextFunction, Request, Response } from 'express';
import { InteractModel } from '../models/interact.model';
import { producer } from '../services/kafka-client';
import { NotificationModel } from '../models/notification.model';
import { interact_type } from '@prisma/client';
import dayjs from 'dayjs';
import utc from 'dayjs/plugin/utc';
import { produceUserEventMessage } from '../services/recommend.service';
dayjs.extend(utc);

export const handleGetPostInteract = async (req: Request, res: Response, next: NextFunction) => {
  const { requestPost } = req;
  try {
    const users = await InteractModel.getByPostId(requestPost.id);
    res.status(200).json({ data: users });
  } catch (error) {
    next(error);
  }
};

interface CreateInteractFields {
  type: interact_type;
  action: string;
  info: Info;
}

interface Info {
  senderName: string;
  senderAvatar?: any;
  receiverID: number;
  itemType: string;
  postID: number;
}

export const handleCreatePostInteract = async (req: Request, res: Response, next: NextFunction) => {
  const { requestUser, requestPost } = req;
  const inputFields: CreateInteractFields = req.body;
  try {
    const interaction = await InteractModel.create(inputFields, requestUser.id, requestPost.id);

    const action = inputFields.action;
    if (action) {
      if (action != 'dislike') {
        const content = `${inputFields.info.senderName} đã ${inputFields.type} ${
          inputFields.info.itemType == 'post' ? 'bài viết' : 'bình luận'
        } của bạn.`;

        await NotificationModel.create({
          userId: inputFields.info.receiverID,
          message: content
        });

        // Produce notification
        producer('notification-topic', [
          {
            key: 'notification',
            value: JSON.stringify({
              senderInfo: { id: requestUser.id, avatar: inputFields.info.senderAvatar },
              receiverID: inputFields.info.receiverID,
              content: content,
              postId: inputFields.info.postID
            })
          }
        ]);
      }
    }

    if (inputFields.type === 'like' && interaction.deleted === false) {
      // Produce like event
      await produceUserEventMessage({
        userId: requestUser.id.toString(),
        postId: requestPost.id.toString(),
        interactionType: inputFields.type,
        timestamp: dayjs().utc().format(),
        metadata: {
          topic_id: requestPost.topicList
        }
      });
    }

    return res.status(200).json({ data: interaction });
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
