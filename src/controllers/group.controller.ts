import { NextFunction, Request, Response } from 'express';
import { GroupModel } from '../models/group.model';

export const handleCreateGroup = async (req: Request, res: Response, next: NextFunction) => {
  const createRequest = req.body;
  try {
    const post = await GroupModel.create(createRequest);
    res.status(200).json({ data: post });
  } catch (error) {
    next(error);
  }
};

export const handleGetGroup = async (req: Request, res: Response, next: NextFunction) => {
  const { requestGroup: group } = req;
  try {
    res.status(200).json({ data: group });
  } catch (error) {
    next(error);
  }
};

export const handleUpdateGroup = async (req: Request, res: Response, next: NextFunction) => {
  const { requestGroup: group } = req;
  const data = req.body;
  try {
    const post = await GroupModel.update(group.id, data);
    res.status(200).json({ data: post });
  } catch (error) {
    next(error);
  }
};

export const handleDeleteGroup = async (req: Request, res: Response, next: NextFunction) => {
  const { requestGroup: group } = req;
  try {
    const post = await GroupModel.delete(group.id);
    res.status(200).json({ data: post });
  } catch (error) {
    next(error);
  }
};

export const handleGetGroupMember = async (req: Request, res: Response, next: NextFunction) => {
  const { requestGroup: group } = req;
  try {
    const members = await GroupModel.getAllMemberById(group.id);
    res.status(200).json({ data: members });
  } catch (error) {
    next(error);
  }
};

type IAddMember = {
  userId: number;
  role: 'admin' | 'user';
};

export const handleAddGroupMember = async (req: Request, res: Response, next: NextFunction) => {
  const { requestGroup: group } = req;
  const body: IAddMember = req.body;
  try {
    const members = await GroupModel.addMember(group.id, body.userId, body.role);
    res.status(200).json({ data: members });
  } catch (error) {
    next(error);
  }
};

export const handleUpdateGroupMember = async (req: Request, res: Response, next: NextFunction) => {
  const { requestGroup: group } = req;
  const { userId, ...body } = req.body;
  try {
    const members = await GroupModel.updateMember(group.id, userId, body);
    res.status(200).json({ data: members });
  } catch (error) {
    next(error);
  }
};

export const handleDeleteGroupMember = async (req: Request, res: Response, next: NextFunction) => {
  const { requestGroup: group } = req;
  const { userId } = req.body;
  try {
    const members = await GroupModel.deleteMember(group.id, userId);
    res.status(200).json({ data: members });
  } catch (error) {
    next(error);
  }
};
