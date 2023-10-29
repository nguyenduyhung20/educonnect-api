import express from 'express';
import { handleDeletePost, handleGetPost, handleGetUserPost, handleUpdatePost } from '../controllers/post.controller';
import { verifyPost } from '../middleware/post.middleware';

export const postRouter = express.Router();

postRouter.get('/', [handleGetUserPost]);
postRouter.get('/uuid/:postUuid', [verifyPost, handleGetPost]);
postRouter.patch('/uuid/:postUuid', [verifyPost, handleUpdatePost]);
postRouter.delete('/uuid/:postUuid', [verifyPost, handleDeletePost]);
