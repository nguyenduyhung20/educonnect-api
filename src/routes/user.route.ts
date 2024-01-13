import express from 'express';
import {
  handleDeleteUser,
  handleGetNewsfeed,
  handleGetUserById,
  handleGetUserNotification,
  handleGetUserProfilePage,
  handleGetUsers,
  handleUpdateUser
} from '../controllers/user.controller';
import { verifyUser } from '../middleware/user.middleware';
import { followRouter } from './follow.route';
import { handleGetHotPostByUserID } from '../controllers/post.controller';

export const userRouter = express.Router();

userRouter.get('/all', [handleGetUsers]);

userRouter.get('/info', [verifyUser, handleGetUserById]);
userRouter.get('/', [verifyUser, handleGetUserById]);
userRouter.patch('/', [verifyUser, handleUpdateUser]);
userRouter.delete('/', [verifyUser, handleDeleteUser]);

userRouter.get('/notifications', [verifyUser, handleGetUserNotification]);

userRouter.get('/newsfeed', [verifyUser, handleGetNewsfeed]);

userRouter.get('/hot-post', [verifyUser, handleGetHotPostByUserID]);

userRouter.use('/follow', [verifyUser, followRouter]);

userRouter.get('/:userId', [verifyUser, handleGetUserProfilePage]);
