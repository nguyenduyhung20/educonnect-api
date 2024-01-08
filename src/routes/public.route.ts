import express from 'express';
import { handleGetHotPost } from '../controllers/post.controller';

// Public post
export const publicRouter = express.Router();

publicRouter.get('/hot-post', [handleGetHotPost]);
