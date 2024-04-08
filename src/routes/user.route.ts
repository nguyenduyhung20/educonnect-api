import express from 'express';
import {
  handleDeleteUser,
  handleGetGroupUserByRole,
  handleGetGroupUserHost,
  handleGetGroupUserJoin,
  handleGetNewsfeed,
  handleGetUserById,
  handleGetUserNotification,
  handleGetUserProfilePage,
  handleGetUsers,
  handleReadNotification,
  handleUpdateAvatar,
  handleUpdateBackGround,
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

userRouter.get('/:userId/host-group', [verifyUser, handleGetGroupUserHost]);
userRouter.get('/:userId/join-group', [verifyUser, handleGetGroupUserByRole]);
userRouter.get('/:userId/host-join-group', [verifyUser, handleGetGroupUserJoin]);

userRouter.get('/:userId', [verifyUser, handleGetUserProfilePage]);

userRouter.post('/avatar/:userId', [verifyUser, handleUpdateAvatar]);
userRouter.post('/background/:userId', [verifyUser, handleUpdateBackGround]);

userRouter.post('/read-notification/:notificationId', [handleReadNotification]);
