import express from 'express';
import {
  handleCreatePostInteract,
  handleDeletePostInteract,
  handleGetPostInteract,
  handleUpdatePostInteract
} from '../controllers/interact.controller';

export const interactRouter = express.Router();

interactRouter.get('/', [handleGetPostInteract]);
interactRouter.post('/', [handleCreatePostInteract]);
interactRouter.patch('/', [handleUpdatePostInteract]);
interactRouter.delete('/', [handleDeletePostInteract]);
