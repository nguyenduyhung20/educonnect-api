import express from 'express';
import { handleGetUserByUuid, handleUpdateUser } from '../controllers/user.controller';

export const userRouter = express.Router();

userRouter.get('/uuid/:userUuid', [handleGetUserByUuid]);
userRouter.patch('/uuid/:userUuid', [handleUpdateUser]);
