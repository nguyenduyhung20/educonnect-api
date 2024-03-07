import express from 'express';
import { handleGetHotPostForPublic } from '../controllers/post.controller';
import { handleGetGroupList } from '../controllers/group.controller';

// Public post
export const publicRouter = express.Router();

publicRouter.get('/hot-post', [handleGetHotPostForPublic]);
publicRouter.get('/hot-group', [handleGetGroupList]);
