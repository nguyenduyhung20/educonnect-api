import express from 'express';
import { handleDeleteUser, handleGetUserByUuid, handleUpdateUser } from '../controllers/user.controller';

export const userRouter = express.Router();

userRouter.get('/uuid/:userUuid', [handleGetUserByUuid]);
userRouter.patch('/uuid/:userUuid', [handleUpdateUser]);
userRouter.delete('/uuid/:userUuid', [handleDeleteUser]);
