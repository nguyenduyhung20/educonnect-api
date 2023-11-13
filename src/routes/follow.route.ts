import express from 'express';
import {
  handleFollowOtherUser,
  handleGetUserFollowInfo,
  handleUnfollowOtherUser
} from '../controllers/user.controller';
import { verifyFollowed } from '../middleware/follow.middleware';

export const followRouter = express.Router();

followRouter.get('/info', handleGetUserFollowInfo);
followRouter.post('/following/uuid/:followedUuid', [verifyFollowed, handleFollowOtherUser]);
followRouter.delete('/following/uuid/:followedUuid', [verifyFollowed, handleUnfollowOtherUser]);
