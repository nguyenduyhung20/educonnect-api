import express from 'express';
import { testRouter } from './test.route';
import { authRouter } from './auth.route';
import { userRouter } from './user.route';
import { groupRouter } from './group.route';
import { postRouter } from './post.route';
import verifyJWT from '../middleware/verifyJWT';

const router = express.Router();

router.use('/v1/test', testRouter);
router.use('/v1/auth', authRouter);
router.use(verifyJWT);
router.use('/v1/user', userRouter);
router.use('/v1/group', groupRouter);
router.use('/v1/post', postRouter);

export default router;
