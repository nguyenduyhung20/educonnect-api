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

// All the action user can do with their post
export const userPostRouter = express.Router();

userPostRouter.get('/', [handleGetUserPost]);
userPostRouter.post('/', [handleCreatePost]);
userPostRouter.patch('/:postUuid', [verifyPost, handleUpdatePost]);
userPostRouter.delete('/:postUuid', [verifyPost, handleDeletePost]);
userPostRouter.use('/:postUuid/interact', [verifyPost, interactRouter]);

// Public post
export const postRouter = express.Router();

postRouter.get('/:postUuid', [verifyPost, handleGetPost]);
