import express from 'express';
import {
  handleDeleteUser,
  handleGetUserByUuid,
  handleGetUserNotification,
  handleGetUsers,
  handleUpdateUser
} from '../controllers/user.controller';
import { verifyUser } from '../middleware/user.middleware';
import { userPostRouter } from './post.route';
import { followRouter } from './follow.route';

export const userRouter = express.Router();

userRouter.get('/all', [handleGetUsers]);
userRouter.get('/:userUuid', [verifyUser, handleGetUserByUuid]);
userRouter.patch('/:userUuid', [verifyUser, handleUpdateUser]);
userRouter.delete('/:userUuid', [verifyUser, handleDeleteUser]);

userRouter.get('/:userUuid/notifications', [verifyUser, handleGetUserNotification]);

userRouter.use('/:userUuid/post', [verifyUser, userPostRouter]);

userRouter.use('/:userUuid/follow', [verifyUser, followRouter]);
