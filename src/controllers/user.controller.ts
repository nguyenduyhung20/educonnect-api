import { NextFunction, Request, Response } from 'express';
import { UserModel } from '../models/user.model';
import { SUCCESS_RESPONSE } from '../constants/success';

export const handleGetUsers = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const users = await UserModel.getAll();
    res.status(200).json({ data: users });
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

export const handleGetNewfeed = async (req: Request, res: Response, next: NextFunction) => {
  const { requestUser } = req;

  try {
    const posts = await UserModel.getFiendsLatestPosts(requestUser.id);

    res.status(200).json({ data: posts });
  } catch (error) {
    next(error);
  }
};
