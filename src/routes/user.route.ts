import express from 'express';
import {
  handleDeleteUser,
  handleGetNewsfeed,
  handleGetUserById,
  handleGetUserNotification,
  handleGetUsers,
  handleUpdateUser
} from '../controllers/user.controller';
import { verifyUser } from '../middleware/user.middleware';
import { userPostRouter } from './post.route';
import { followRouter } from './follow.route';

export const userRouter = express.Router();

userRouter.get('/all', [handleGetUsers]);
userRouter.get('/info', [verifyUser, handleGetUserById]);
userRouter.get('/:userId', [verifyUser, handleGetUserById]);
userRouter.patch('/:userId', [verifyUser, handleUpdateUser]);
userRouter.delete('/:userId', [verifyUser, handleDeleteUser]);

userRouter.get('/:userId/notifications', [verifyUser, handleGetUserNotification]);

userRouter.use('/:userId/post', [verifyUser, userPostRouter]);

userRouter.use('/:userId/follow', [verifyUser, followRouter]);

userRouter.get('/:userId/newsfeed', [verifyUser, handleGetNewsfeed]);
