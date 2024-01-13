import express from 'express';
import { handleSearchUser } from '../controllers/user.controller';
import { handleSearchPost } from '../controllers/post.controller';
import { handleSearchGroup } from '../controllers/group.controller';

export const searchRouter = express.Router();

searchRouter.get('/user', [handleSearchUser]);
searchRouter.get('/post', [handleSearchPost]);
searchRouter.get('/group', [handleSearchGroup]);
