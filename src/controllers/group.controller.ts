import { NextFunction, Request, Response } from 'express';
import { GroupModel } from '../models/group.model';
import { UserModel } from '../models/user.model';
import { AppError } from '../config/AppError';
import { SearchService } from '../services/group.service';
import { member_status } from '@prisma/client';
import { UploadedFile } from 'express-fileupload';
import { uploadFile } from '../utils/uploadFile';

export const handleGetGroupList = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const post = await GroupModel.getMostMembers();
    res.status(200).json({ data: post });
  } catch (error) {
    next(error);
  }
};

export const handleCreateGroup = async (req: Request, res: Response, next: NextFunction) => {
  const createRequest = req.body;
  const uploadedFiles = req.files?.uploadedFiles as UploadedFile | UploadedFile[];
  const userId = req.requestUser.id;

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

    const post = await GroupModel.create(createRequest, listFile, userId);
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
  const { requestGroup } = req;
  const data = req.body;
  try {
    const group = await GroupModel.update(requestGroup.id, data);
    res.status(200).json({ data: group });
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

export const handleGetGroupMemberByStatus = async (req: Request, res: Response, next: NextFunction) => {
  const { requestGroup: group } = req;
  const userId: number = req.body.userId;
  let status: member_status = req.params.status as any;
  try {
    const checkAdmin = await GroupModel.checkJoinGroup(group.id, userId);
    if (checkAdmin?.role !== 'admin') {
      status = 'active';
    }
    const members = await GroupModel.getAllMemberByIdAndStatus(group.id, status);
    res.status(200).json({ data: members });
  } catch (error) {
    next(error);
  }
};

export const handleCheckJoinGroup = async (req: Request, res: Response, next: NextFunction) => {
  const { requestGroup: group } = req;
  try {
    const members = await GroupModel.checkJoinGroup(group.id, req.body.userId);
    res.status(200).json({
      data: {
        userId: members?.user_id,
        groupId: members?.group_id,
        role: members?.role,
        status: members?.status
      }
    });
  } catch (error) {
    next(error);
  }
};

export const handleGetListApplyingGroup = async (req: Request, res: Response, next: NextFunction) => {
  const { groupId } = req.params;
  try {
    const result = await GroupModel.getListApplyingGroup(parseInt(groupId, 10));

    return res.status(200).json({
      data: result.map((item) => {
        return {
          ...item,
          user: {
            ...item.user,
            avatar: item.user.avatar?.startsWith('http')
              ? item.user.avatar
              : process.env.NEXT_PUBLIC_API_HOST + (item.user.avatar ?? '')
          }
        };
      })
    });
  } catch (error) {
    next(error);
  }
};

type IAddMember = {
  memberId: number;
  role: 'admin' | 'user';
};

export const handleAddGroupMember = async (req: Request, res: Response, next: NextFunction) => {
  const { requestGroup } = req;
  const body: IAddMember = req.body;
  try {
    const member = await UserModel.getById(body.memberId);
    if (!member) {
      throw new AppError(400, 'BAD_REQUEST');
    }
    const members = await GroupModel.addMember(requestGroup.id, member.id);
    res.status(200).json({ data: members });
  } catch (error) {
    next(error);
  }
};

export const handleApproveMember = async (req: Request, res: Response, next: NextFunction) => {
  const { groupId } = req.params;
  const body = req.body;
  try {
    const members = await GroupModel.approveMember(parseInt(groupId, 10), body.memberId);
    res.status(200).json({ data: members });
  } catch (error) {
    next(error);
  }
};

export const handleRefuseMember = async (req: Request, res: Response, next: NextFunction) => {
  const { groupId } = req.params;
  const body = req.body;
  try {
    const members = await GroupModel.refuseMember(parseInt(groupId, 10), body.memberId);
    res.status(200).json({ data: members });
  } catch (error) {
    next(error);
  }
};

export const handleUpdateGroupMember = async (req: Request, res: Response, next: NextFunction) => {
  const { requestGroup: group } = req;
  const { userId, ...body } = req.body;
  try {
    const checkAdmin = await GroupModel.checkJoinGroup(group.id, userId);
    if (checkAdmin?.role !== 'admin') {
      res.status(400).json({ message: 'Tài khoản không có quyền này' });
      return;
    }
    const members = await GroupModel.updateMember(group.id, body?.memberId, body?.role, body?.status);
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

export const handleSearchGroup = async (req: Request, res: Response, next: NextFunction) => {
  const { text } = req.query;
  try {
    const members = await SearchService.searchGroup(text as string);
    res.status(200).json({ data: members });
  } catch (error) {
    next(error);
  }
};
