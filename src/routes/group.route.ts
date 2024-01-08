import express from 'express';
import { verifyGroup } from '../middleware/group.middleware';
import {
  handleAddGroupMember,
  handleDeleteGroupMember,
  handleGetGroupList,
  handleUpdateGroupMember
} from '../controllers/group.controller';
import {
  handleCreateGroup,
  handleDeleteGroup,
  handleGetGroup,
  handleGetGroupMember,
  handleUpdateGroup
} from '../controllers/group.controller';
import { handleGetGroupPosts } from '../controllers/post.controller';

export const groupRouter = express.Router();

groupRouter.get('/', [handleGetGroupList]);
groupRouter.post('/', [handleCreateGroup]);
groupRouter.get('/:groupId', [verifyGroup, handleGetGroup]);
groupRouter.patch('/:groupId', [verifyGroup, handleUpdateGroup]);
groupRouter.delete('/:groupId', [verifyGroup, handleDeleteGroup]);

// Post
groupRouter.get('/:groupId/posts', [verifyGroup, handleGetGroupPosts]);

// Member
groupRouter.get('/:groupId/members', [verifyGroup, handleGetGroupMember]);
groupRouter.post('/:groupId/members', [verifyGroup, handleAddGroupMember]);
groupRouter.patch('/:groupId/members', [verifyGroup, handleUpdateGroupMember]);
groupRouter.delete('/:groupId/members', [verifyGroup, handleDeleteGroupMember]);
