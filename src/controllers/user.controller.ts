import { NextFunction, Request, Response } from 'express';
import { UserRepository } from '../models/user.model';

export const handleGetUserByUuid = async (req: Request, res: Response, next: NextFunction) => {
  const { requestUser: user } = req;
  try {
    res.status(200).json({ user });
  } catch (error) {
    next(error);
  }
};

export const handleUpdateUser = async (req: Request, res: Response, next: NextFunction) => {
  const { requestUser, body: updateFields } = req;
  try {
    const user = await UserRepository.updateByUuid(requestUser.user_uuid, updateFields);
    res.status(200).json({ user });
  } catch (error) {
    next(error);
  }
};

export const handleDeleteUser = async (req: Request, res: Response, next: NextFunction) => {
  const { requestUser } = req;
  try {
    const user = await UserRepository.deleteByUuid(requestUser.user_uuid);
    res.status(200).json({ user });
  } catch (error) {
    next(error);
  }
};
