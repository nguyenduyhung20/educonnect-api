import express from 'express';
import {
  handleDeleteUser,
  handleGetUserByUuid,
  handleGetUsers,
  handleUpdateUser
} from '../controllers/user.controller';
import { verifyUser } from '../middleware/user.middleware';
import { postRouter } from './post.route';

export const userRouter = express.Router();

userRouter.get('/all', [handleGetUsers]);
userRouter.get('/uuid/:userUuid', [verifyUser, handleGetUserByUuid]);
userRouter.patch('/uuid/:userUuid', [verifyUser, handleUpdateUser]);
userRouter.delete('/uuid/:userUuid', [verifyUser, handleDeleteUser]);
userRouter.use('/uuid/:userUuid/post', [verifyUser, postRouter]);
