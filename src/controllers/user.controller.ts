import { NextFunction, Request, Response } from 'express';
import { UserModel } from '../models/user.model';
import { SUCCESS_RESPONSE } from '../constants/success';
import { AppError } from '../config/AppError';
import { PostService } from '../services/post.service';
import { redisClient } from '../config/redis-client';
import { PostModel } from '../models/post.model';
import { GroupModel } from '../models/group.model';

export const handleGetUsers = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const users = await UserModel.getAll();
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

export const handleGetGroupUserJoin = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { requestUser } = req;
    const group = await GroupModel.getGroupsByUserRole(requestUser.id, 'user');
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
    const notifications = await UserModel.getNotifications(requestUser.id);

    res.status(200).json({ data: notifications });
  } catch (error) {
    next(error);
  }
};

export const handleGetNewsfeed = async (req: Request, res: Response, next: NextFunction) => {
  const { requestUser } = req;

  try {
    await redisClient.select(1);
    const listIdPosts = await redisClient.zRange(`${requestUser.id}`, 0, 9);
    await redisClient.zRemRangeByRank(`${requestUser.id}`, 0, 9);
    if (listIdPosts.length) {
      const postIdNumberList = listIdPosts.map(Number);
      const posts = await PostModel.getByListIdNotHaveComment(postIdNumberList, requestUser.id);
      res.status(200).json({ data: posts });
    } else {
      const posts = await UserModel.getFiendsLatestPosts(requestUser.id);
      const mySeftPosts = await PostService.getUserPosts({
        userId: requestUser.id,
        userIdRequesting: requestUser.id,
        detail: false
      });

      const hotposts = await PostModel.getHotPostByUserID(requestUser.id);

      const results = [...(posts || []), ...(mySeftPosts || []), ...(hotposts || [])];
      redisClient.select(1);
      results.forEach(async (item) => {
        const key = `${requestUser.id}` || '';
        const value = `${item.id}` || '';
        await redisClient.zAdd(key, { score: 1, value: value });
      });

      res.status(200).json({ data: results });
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
      detail: true
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
