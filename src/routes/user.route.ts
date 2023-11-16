import express from 'express';
import {
  handleDeleteUser,
  handleGetUserByUuid,
  handleGetUserNotification,
  handleGetUsers,
  handleUpdateUser
} from '../controllers/user.controller';
import { verifyUser } from '../middleware/user.middleware';
import { postRouter } from './post.route';
import { followRouter } from './follow.route';

export const userRouter = express.Router();

userRouter.get('/all', [handleGetUsers]);
userRouter.get('/uuid/:userUuid', [verifyUser, handleGetUserByUuid]);
userRouter.patch('/uuid/:userUuid', [verifyUser, handleUpdateUser]);
userRouter.delete('/uuid/:userUuid', [verifyUser, handleDeleteUser]);

userRouter.get('/uuid/:userUuid/notifications', [verifyUser, handleGetUserNotification]);

userRouter.use('/uuid/:userUuid/post', [verifyUser, postRouter]);

userRouter.use('/uuid/:userUuid/follow', [verifyUser, followRouter]);
