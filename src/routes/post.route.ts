import express from 'express';
import {
  handleCreatePost,
  handleDeletePost,
  handleGetPost,
  handleGetUserPost,
  handleUpdatePost
} from '../controllers/post.controller';
import { verifyPost } from '../middleware/post.middleware';
import { interactRouter } from './interact.route';

export const postRouter = express.Router();

postRouter.get('/', [handleGetUserPost]);
postRouter.get('/uuid/:postUuid', [verifyPost, handleGetPost]);
postRouter.post('/', [handleCreatePost]);
postRouter.patch('/uuid/:postUuid', [verifyPost, handleUpdatePost]);
postRouter.delete('/uuid/:postUuid', [verifyPost, handleDeletePost]);
postRouter.use('/uuid/:postUuid/interact', [verifyPost, interactRouter]);
