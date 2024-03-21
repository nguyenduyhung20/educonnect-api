import express from 'express';
import { handleGetHotPostForPublic } from '../controllers/post.controller';
import { handleGetGroupList } from '../controllers/group.controller';
import { handleGetPublicExplorePost, handleGetPublicMostUserFollower } from '../controllers/explore.controller';

// Public post
export const publicRouter = express.Router();

publicRouter.get('/hot-post', [handleGetHotPostForPublic]);
publicRouter.get('/hot-group', [handleGetGroupList]);
publicRouter.get('/explore', [handleGetPublicExplorePost]);
publicRouter.get('/most-follower', [handleGetPublicMostUserFollower]);