import { NextFunction, Request, Response } from 'express';
import { UserModel } from '../models/user.model';
import { SUCCESS_RESPONSE } from '../constants/success';
import { AppError } from '../config/AppError';
import { PostService } from '../services/post.service';
import { redisClient } from '../config/redis-client';
import { PostModel } from '../models/post.model';
import { GroupModel } from '../models/group.model';
import { UploadedFile } from 'express-fileupload';
import { uploadFile } from '../utils/uploadFile';
import { NotificationModel } from '../models/notification.model';
import { getRecommendPosts } from '../services/recommend.service';
import prisma from '../databases/client';
import { getUniqueObjects, shuffleArray } from '../utils/array';

export const handleGetUsers = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const users = await UserModel.getAll();
    res.status(200).json({ data: users });
  } catch (error) {
    next(error);
  }
};

export const handleUpdateAvatar = async (req: Request, res: Response, next: NextFunction) => {
  const { requestUser } = req;
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
    const users = await UserModel.changeAvatar(requestUser.id, listFile[0]);
    res.status(200).json({ data: users });
  } catch (error) {
    next(error);
  }
};

export const handleUpdateBackGround = async (req: Request, res: Response, next: NextFunction) => {
  const { requestUser } = req;
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
    const users = await UserModel.changeBackground(requestUser.id, listFile[0]);
    res.status(200).json({ data: users });
  } catch (error) {
    next(error);
  }
};

export const handleGetGroupUserHost = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { requestUser } = req;
    const group = await GroupModel.getGroupsByUserRole(requestUser.id, 'admin');
    res.status(200).json({ data: group });
  } catch (error) {
    next(error);
  }
};

export const handleGetGroupUserByRole = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { requestUser } = req;
    const group = await GroupModel.getGroupsByUserRole(requestUser.id, 'user');
    res.status(200).json({ data: group });
  } catch (error) {
    next(error);
  }
};

export const handleGetGroupUserJoin = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { requestUser } = req;
    const group = await GroupModel.getGroupsByUserJoin(requestUser.id);
    res.status(200).json({ data: group });
  } catch (error) {
    next(error);
  }
};

export const handleGetUserById = async (req: Request, res: Response, next: NextFunction) => {
  const { requestUser: user } = req;
  try {
    res.status(200).json({ data: user });
  } catch (error) {
    next(error);
  }
};

export const handleCreateUser = async (req: Request, res: Response, next: NextFunction) => {
  const { body: userFields } = req;
  try {
    const user = await UserModel.create(userFields);
    const accountData = {
      id: user.id,
      username: (user.name?.replace(/\s/g, '') || '') + user.id,
      password: '123123'
    };
    const account = await UserModel.createAccount(accountData);
    res.status(200).json({ data: { ...user, ...account } });
  } catch (error) {
    next(error);
  }
};

export const handleUpdateUser = async (req: Request, res: Response, next: NextFunction) => {
  const { requestUser, body: updateFields } = req;
  try {
    const user = await UserModel.update(requestUser.id, updateFields);
    res.status(200).json({ data: user });
  } catch (error) {
    next(error);
  }
};

export const handleDeleteUser = async (req: Request, res: Response, next: NextFunction) => {
  const { requestUser } = req;
  try {
    const user = await UserModel.delete(requestUser.id);
    res.status(200).json({ data: user });
  } catch (error) {
    next(error);
  }
};

// GET user/:userId/follow/info
export const handleGetUserFollowInfo = async (req: Request, res: Response, next: NextFunction) => {
  const { requestUser } = req;

  try {
    const result = await UserModel.getFollowInfo(requestUser.id);
    res.status(200).json({ data: result });
  } catch (error) {
    next(error);
  }
};

// POST user/:userId/follow/following/:followedUuid
export const handleFollowOtherUser = async (req: Request, res: Response, next: NextFunction) => {
  const { requestUser, requestFollowed } = req;

  try {
    await UserModel.followOther(requestUser.id, requestFollowed.id);
    res.status(200).json(SUCCESS_RESPONSE);
  } catch (error) {
    next(error);
  }
};

// DELETE user/:userId/follow/following/:followedUuid
export const handleUnfollowOtherUser = async (req: Request, res: Response, next: NextFunction) => {
  const { requestUser, requestFollowed } = req;

  try {
    await UserModel.unfollowOther(requestUser.id, requestFollowed.id);

    res.status(200).json(SUCCESS_RESPONSE);
  } catch (error) {
    next(error);
  }
};

export const handleGetUserNotification = async (req: Request, res: Response, next: NextFunction) => {
  const { requestUser } = req;

  try {
    const notifications = await NotificationModel.getNotifications(requestUser.id);

    res.status(200).json({ data: notifications });
  } catch (error) {
    next(error);
  }
};

export const handleGetNewsfeed = async (req: Request, res: Response, next: NextFunction) => {
  const { requestUser } = req;

  try {
    // Take 10 top post saved in redis sorted set with key is user id
    const listIdPosts = await redisClient.zRange(`${requestUser.id}`, 0, 9);
    // Delete them after read
    await redisClient.zRemRangeByRank(`${requestUser.id}`, 0, 9);

    if (listIdPosts.length > 0) {
      const postIdNumberList = listIdPosts.map(Number);
      const posts = await PostService.getPostsList({
        postIdList: postIdNumberList,
        userIdRequesting: requestUser.id,
        isComment: false,
        isSummarize: false
      });
      return res.status(200).json({ data: posts });
    } else {
      const posts = await UserModel.getFiendsLatestPosts(requestUser.id);
      const selfPosts = await PostService.getUserPosts({
        userId: requestUser.id,
        userIdRequesting: requestUser.id,
        detail: false
      });

      const recommendPosts = await getRecommendPosts({ userId: requestUser.id });

      // About 10 post
      const hotPosts = await PostModel.getHotPostByUserID(requestUser.id);

      const uniqueResults = getUniqueObjects(
        [...(posts || []), ...(selfPosts || []), ...(hotPosts || []), ...(recommendPosts || [])],
        'id'
      );
      const results = shuffleArray(uniqueResults);

      // User will read the first 10 post, so we cache the next 10 posts
      const cacheResults = results.slice(10);

      cacheResults.forEach(async (item) => {
        const key = `${requestUser.id}` || '';
        const value = `${item.id}` || '';
        await redisClient.zAdd(key, { score: 1, value: value });
      });

      return res.status(200).json({ data: results.slice(0, 9) });
    }
  } catch (error) {
    next(error);
  }
};

export const handleSearchUser = async (req: Request, res: Response, next: NextFunction) => {
  const { name } = req.query;
  try {
    const users = await UserModel.searchUser(name as string);

    res.status(200).json({ data: users });
  } catch (error) {
    next(error);
  }
};

export const handleGetUserProfilePage = async (req: Request, res: Response, next: NextFunction) => {
  const { userId } = req.params;
  const { requestUser } = req;
  try {
    const user = await UserModel.getById(parseInt(userId as string, 10));

    if (!user) {
      throw new AppError(404, 'NOT_FOUND');
    }

    const newsfeed = await PostService.getUserPosts({
      userId: user.id,
      userIdRequesting: requestUser.id,
      detail: false
    });

    const data = {
      data: {
        user: user,
        newsfeed: newsfeed
      }
    };

    return res.status(200).json(data);
  } catch (error) {
    next(error);
  }
};

export const handleReadNotification = async (req: Request, res: Response, next: NextFunction) => {
  const { notificationId } = req.params;
  try {
    const data = await NotificationModel.updateIsRead(parseInt(notificationId as string, 10));

    return res.status(200).json(data);
  } catch (error) {
    next(error);
  }
};

export const handleOverviewActivity = async (req: Request, res: Response, next: NextFunction) => {
  const { requestUser } = req;
  try {
    const recentActivity = await prisma.user.findFirst({
      where: {
        id: requestUser.id
      },
      select: {
        _count: {
          select: {
            post: {
              where: {
                parent_post_id: {
                  not: null
                }
              }
            },
            interact: {
              where: {
                deleted: false
              }
            }
          }
        }
      }
    });

    const data = {
      interactNumber: recentActivity?._count.interact,
      commentNumber: recentActivity?._count.post
    };

    return res.status(200).json({ data });
  } catch (error) {
    next(error);
  }
};
