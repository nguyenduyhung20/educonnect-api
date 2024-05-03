import express from 'express';
import {
  handleDeletePostReported,
  handleGetReportPostGroup,
  handleReportPost,
  handleSkipReportedPost
} from '../controllers/report.controller';

export const reportRoute = express.Router();

reportRoute.post(`/`, [handleReportPost]);
reportRoute.get(`/group/:groupId`, [handleGetReportPostGroup]);
reportRoute.patch(`/group`, [handleSkipReportedPost]);
reportRoute.patch(`/group/delete`, [handleDeletePostReported]);
