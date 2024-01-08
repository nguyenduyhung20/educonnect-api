import express from 'express';
import {
  handleFollowOtherUser,
  handleGetUserFollowInfo,
  handleUnfollowOtherUser
} from '../controllers/user.controller';
import { verifyFollowed } from '../middleware/follow.middleware';

export const followRouter = express.Router();

followRouter.get('/', handleGetUserFollowInfo);
followRouter.post('/:followedId', [verifyFollowed, handleFollowOtherUser]);
followRouter.delete('/:followedId', [verifyFollowed, handleUnfollowOtherUser]);
