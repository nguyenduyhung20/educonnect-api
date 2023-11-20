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
import { handleGetGroupPosts } from '../controllers/post.controller';

export const groupRouter = express.Router();

groupRouter.post('/', [handleCreateGroup]);
groupRouter.get('/:groupUuid', [verifyGroup, handleGetGroup]);
groupRouter.patch('/:groupUuid', [verifyGroup, handleUpdateGroup]);
groupRouter.delete('/:groupUuid', [verifyGroup, handleDeleteGroup]);

// Post
groupRouter.get('/:groupUuid/posts', [verifyGroup, handleGetGroupPosts]);

// Member
groupRouter.get('/:groupUuid/members', [verifyGroup, handleGetGroupMember]);
groupRouter.post('/:groupUuid/members', [verifyGroup, handleAddGroupMember]);
groupRouter.patch('/:groupUuid/members', [verifyGroup, handleUpdateGroupMember]);
groupRouter.delete('/:groupUuid/members', [verifyGroup, handleDeleteGroupMember]);
