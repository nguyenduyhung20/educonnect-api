import express from 'express';
import { handleGetExplorePost } from '../controllers/explore.controller';

export const exploreRouter = express.Router();

exploreRouter.get('/', [handleGetExplorePost]);
