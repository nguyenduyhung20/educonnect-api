import express from 'express';
import { handleExploreSearch, handleGetExplorePost } from '../controllers/explore.controller';

export const exploreRouter = express.Router();

exploreRouter.get('/search', [handleExploreSearch]);

exploreRouter.get('/', [handleGetExplorePost]);
