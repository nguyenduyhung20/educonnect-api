import express from 'express';
import {
  handleCreateComment,
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
userPostRouter.patch('/:postId', [verifyPost, handleUpdatePost]);
userPostRouter.delete('/:postId', [verifyPost, handleDeletePost]);

// User have userUuid post comment to a post which have postId
userPostRouter.post('/:postId/comment', [verifyPost, handleCreateComment]);

userPostRouter.use('/:postId/interact', [verifyPost, interactRouter]);

// Public post
export const postRouter = express.Router();

postRouter.get('/:postId', [verifyPost, handleGetPost]);
