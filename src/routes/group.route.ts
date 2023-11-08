import express from 'express';
import { verifyGroup } from '../middleware/group.middleware';
import {
  handleAddGroupMember,
  handleDeleteGroupMember,
  handleUpdateGroupMember
} from '../controllers/group.controller';
import {
  handleCreateGroup,
  handleDeleteGroup,
  handleGetGroup,
  handleGetGroupMember,
  handleUpdateGroup
} from '../controllers/group.controller';

export const groupRouter = express.Router();

groupRouter.post('/', [handleCreateGroup]);
groupRouter.get('/uuid/:groupUuid', [verifyGroup, handleGetGroup]);
groupRouter.patch('/uuid/:groupUuid', [verifyGroup, handleUpdateGroup]);
groupRouter.delete('/uuid/:groupUuid', [verifyGroup, handleDeleteGroup]);
groupRouter.get('/uuid/:groupUuid/members', [verifyGroup, handleGetGroupMember]);
groupRouter.post('/uuid/:groupUuid/members', [verifyGroup, handleAddGroupMember]);
groupRouter.patch('/uuid/:groupUuid/members', [verifyGroup, handleUpdateGroupMember]);
groupRouter.delete('/uuid/:groupUuid/members', [verifyGroup, handleDeleteGroupMember]);
