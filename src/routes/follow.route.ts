import express from 'express';
import {
  handleFollowOtherUser,
  handleGetUserFollowInfo,
  handleUnfollowOtherUser
} from '../controllers/user.controller';
import { verifyFollowed } from '../middleware/follow.middleware';

export const followRouter = express.Router();

followRouter.get('/info', handleGetUserFollowInfo);
followRouter.post('/following/:followedUuid', [verifyFollowed, handleFollowOtherUser]);
followRouter.delete('/following/:followedUuid', [verifyFollowed, handleUnfollowOtherUser]);
