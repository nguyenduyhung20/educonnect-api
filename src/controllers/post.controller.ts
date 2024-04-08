import { NextFunction, Request, Response } from 'express';
import { PostModel } from '../models/post.model';
import { AppError } from '../config/AppError';
import prisma from '../databases/client';
import { PostService } from '../services/post.service';
import { UploadedFile } from 'express-fileupload';
import { uploadFile } from '../utils/uploadFile';
import { producer } from '../services/kafka-client';
import cheerio from 'cheerio';
import axios from 'axios';
import { produceUserEventMessage } from '../services/recommend.service';
import dayjs from 'dayjs';

export const handleGetHotPostByUserID = async (req: Request, res: Response, next: NextFunction) => {
  const { requestUser } = req;
  try {
    const result = await PostModel.getHotPostByUserID(requestUser.id);
    return res.status(200).json({ data: result });
  } catch (error) {
    next(error);
  }
};

export const handleGetUserPost = async (req: Request, res: Response, next: NextFunction) => {
  const { requestUser } = req;
  const { detail } = req.query;
  try {
    if (detail === 'true') {
      const result = await PostService.getUserPosts({
        userId: requestUser.id,
        userIdRequesting: requestUser.id,
        detail: true
      });
      return res.status(200).json({ data: result });
    } else {
      const result = await PostService.getUserPosts({
        userId: requestUser.id,
        userIdRequesting: requestUser.id,
        detail: false
      });
      return res.status(200).json({ data: result });
    }
  } catch (error) {
    next(error);
  }
};

export const handleGetGroupPosts = async (req: Request, res: Response, next: NextFunction) => {
  const { requestUser, requestGroup } = req;
  try {
    const result = await PostService.getGroupPosts({ groupId: requestGroup.id, userIdRequesting: requestUser.id });

    return res.status(200).json({ data: result });
  } catch (error) {
    next(error);
  }
};

export const handleGetHotPostForPublic = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const result = await PostModel.getHotPostsForPublic();

    return res.status(200).json({ data: result });
  } catch (error) {
    next(error);
  }
};

export const handleGetPost = async (req: Request, res: Response, next: NextFunction) => {
  const { requestPost, requestUser } = req;
  try {
    const interact = await prisma.interact.findFirst({
      where: {
        user_id: requestUser.id,
        post_id: requestPost.id
      }
    });
    const data = {
      ...requestPost,
      userInteract: !interact?.deleted ? interact?.type : null
    };
    return res.status(200).json({ data: data });
  } catch (error) {
    next(error);
  }
};

export const handleCreatePost = async (req: Request, res: Response, next: NextFunction) => {
  const { requestUser, body: postFields } = req;
  const uploadedFiles = req.files?.uploadedFiles as UploadedFile | UploadedFile[];
  const listFile = [];
  try {
    if (uploadedFiles) {
      if (Array.isArray(uploadedFiles)) {
        for (const file of uploadedFiles) {
          const result = await uploadFile(file);
          listFile.push(result);
        }
      } else {
        const result = await uploadFile(uploadedFiles);
        listFile.push(result);
      }
    }

    const groupId = postFields?.groupId;

    const type: 'post' | 'link' = postFields.type;

    if (type == 'link') {
      const fetchPreviewData = async () => {
        try {
          const link = postFields.content;
          const response = await axios.get(link);
          const html = await response.data;
          const $ = cheerio.load(html);

          const title = $('title').text();
          const description = $('meta[name="description"]').attr('content') || '';
          const imageUrl = $('meta[property="og:image"]').attr('content');

          postFields.content = `${title}\n${description}\nChi tiết: ${link}`;
          listFile.push(imageUrl);
        } catch (error) {
          console.error('Error fetching preview data:', error);
          throw new Error('Error fetching preview data');
        }
      };
      try {
        await fetchPreviewData();
      } catch (error) {
        return res.status(500).json({ message: 'Error Internal Server' });
      }
    }

    const post = await PostModel.create(requestUser.id, postFields, listFile, groupId);

    const messages = [
      {
        key: 'post',
        value: JSON.stringify({
          content: postFields.content,
          user_id: requestUser.id,
          post_uuid: post.post_uuid,
          id: post.id
        })
      }
    ];
    producer('post-topic', messages);
    return res.status(200).json({ data: post });
  } catch (error) {
    next(error);
  }
};

export const handleUpdatePost = async (req: Request, res: Response, next: NextFunction) => {
  const { requestPost, body: postFields, requestUser } = req;
  try {
    if (requestPost.user.id !== requestUser.id) {
      throw new AppError(404, 'NOT_FOUND');
    }
    const post = await PostModel.update(requestPost.id, postFields);
    return res.status(200).json({ data: post });
  } catch (error) {
    next(error);
  }
};

export const handleDeletePost = async (req: Request, res: Response, next: NextFunction) => {
  const { requestUser, requestPost } = req;
  try {
    if (requestPost.user.id !== requestUser.id) {
      throw new AppError(404, 'NOT_FOUND');
    }
    const post = await PostModel.delete(requestUser.id, requestPost.id);
    return res.status(200).json({ data: post });
  } catch (error) {
    next(error);
  }
};

export const handleCreateComment = async (req: Request, res: Response, next: NextFunction) => {
  const { requestUser, requestPost, body: postFields } = req;
  try {
    const post = await PostModel.createComment(requestUser.id, requestPost.id, postFields);
    // Produce comment event
    await produceUserEventMessage({
      userId: requestUser.id.toString(),
      postId: requestPost.id.toString(),
      interactionType: 'comment',
      timestamp: dayjs().utc().format(),
      metadata: {
        topic_id: requestPost.topicList
      }
    });
    return res.status(200).json({ data: post });
  } catch (error) {
    next(error);
  }
};

export const handleSearchPost = async (req: Request, res: Response, next: NextFunction) => {
  const { text } = req.query;
  try {
    const posts = await PostModel.searchPost(text as string);
    return res.status(200).json({ data: posts });
  } catch (error) {
    next(error);
  }
};

export const handleGetMostInteractPost = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const posts = await PostModel.getMostInteractPost();
    return res.status(200).json({ data: posts });
  } catch (error) {
    next(error);
  }
};
