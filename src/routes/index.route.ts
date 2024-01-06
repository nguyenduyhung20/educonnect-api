import express from 'express';
import { testRouter } from './test.route';
import { authRouter } from './auth.route';
import { userRouter } from './user.route';
import { groupRouter } from './group.route';
import { postRouter } from './post.route';
import verifyJWT from '../middleware/verifyJWT';

const router = express.Router();

router.use('/test', testRouter);
router.use('/auth', authRouter);
router.use(verifyJWT);
router.use('/user', userRouter);
router.use('/group', groupRouter);
router.use('/post', postRouter);

export default router;
