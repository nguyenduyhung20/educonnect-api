import { NextFunction, Request, Response } from 'express';
import { UserRepository } from '../models/user.model';

export const handleGetUsers = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const users = await UserRepository.getAll();
    res.status(200).json({ users });
  } catch (error) {
    next(error);
  }
};

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
    const user = await UserRepository.update(requestUser.id, updateFields);
    res.status(200).json({ user });
  } catch (error) {
    next(error);
  }
};

export const handleDeleteUser = async (req: Request, res: Response, next: NextFunction) => {
  const { requestUser } = req;
  try {
    const user = await UserRepository.delete(requestUser.id);
    res.status(200).json({ user });
  } catch (error) {
    next(error);
  }
};
