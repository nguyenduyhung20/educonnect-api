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

export const postRouter = express.Router();

postRouter.get('/', [handleGetUserPost]);

postRouter.post('/', [handleCreatePost]);
postRouter.get('/:postId', [verifyPost, handleGetPost]);
postRouter.patch('/:postId', [verifyPost, handleUpdatePost]);
postRouter.delete('/:postId', [verifyPost, handleDeletePost]);

// User have userUuid post comment to a post which have postId
postRouter.post('/:postId/comment', [verifyPost, handleCreateComment]);

postRouter.use('/:postId/interact', [verifyPost, interactRouter]);
