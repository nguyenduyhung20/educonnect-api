import { NextFunction, Request, Response } from 'express';
import { ReportPostModel } from '../models/report.model';

export const handleReportPost = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { postId, groupId, userId, reason } = req.body;
    const result = await ReportPostModel.create(
      parseInt(postId, 10),
      parseInt(userId, 10),
      reason,
      parseInt(groupId, 10)
    );
    return res.status(200).json({ data: result });
  } catch (error) {
    next(error);
  }
};

export const handleGetReportPostGroup = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { groupId } = req.params;
    const result = await ReportPostModel.getAllReportPostGroup(parseInt(groupId, 10));
    return res.status(200).json({ data: result });
  } catch (error) {
    next(error);
  }
};

export const handleSkipReportedPost = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { postId, userId } = req.body;
    const result = await ReportPostModel.skipReportPostGroup(parseInt(postId, 10), parseInt(userId, 10));
    return res.status(200).json({ data: result });
  } catch (error) {
    next(error);
  }
};

export const handleDeletePostReported = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { postId, groupId, userId } = req.body;
    await ReportPostModel.skipReportPostGroup(parseInt(postId, 10), parseInt(userId, 10));
    const result = await ReportPostModel.deletePostReported(parseInt(postId, 10), parseInt(groupId, 10));
    return res.status(200).json({ data: result });
  } catch (error) {
    next(error);
  }
};
