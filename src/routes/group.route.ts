import express from 'express';
import { verifyGroup } from '../middleware/group.middleware';
import {
  handleAddGroupMember,
  handleCheckJoinGroup,
  handleGetGroupMemberByStatus,
  handleDeleteGroupMember,
  handleGetGroupList,
  handleUpdateGroupMember,
  handleGetListApplyingGroup,
  handleApproveMember,
  handleRefuseMember
} from '../controllers/group.controller';
import {
  handleCreateGroup,
  handleDeleteGroup,
  handleGetGroup,
  handleGetGroupMember,
  handleUpdateGroup
} from '../controllers/group.controller';
import { handleGetGroupPosts } from '../controllers/post.controller';
import { verifyAdminGroup, verifyUser } from '../middleware/user.middleware';

export const groupRouter = express.Router();

groupRouter.get('/', [handleGetGroupList]);
groupRouter.post('/', [verifyUser, handleCreateGroup]);
groupRouter.get('/:groupId', [verifyGroup, handleGetGroup]);
groupRouter.patch('/:groupId', [verifyGroup, handleUpdateGroup]);
groupRouter.delete('/:groupId', [verifyGroup, handleDeleteGroup]);

// Post
groupRouter.get('/:groupId/posts', [verifyGroup, handleGetGroupPosts]);

// List user apply group
groupRouter.get('/list-apply-group/:groupId/:userId', [verifyGroup, verifyAdminGroup, handleGetListApplyingGroup]);
//approve member
groupRouter.post('/approve/:groupId/:userId', [verifyGroup, verifyAdminGroup, handleApproveMember]);
//refuse member
groupRouter.post('/refuse/:groupId/:userId', [verifyGroup, verifyAdminGroup, handleRefuseMember]);

// Member
groupRouter.get('/:groupId/members', [verifyGroup, handleGetGroupMember]);
groupRouter.get('/:groupId/members/status/:status', [verifyGroup, handleGetGroupMemberByStatus]);
groupRouter.get('/:groupId/members/:memberId', [verifyGroup, handleCheckJoinGroup]);
groupRouter.post('/:groupId/members', [verifyGroup, handleAddGroupMember]);
groupRouter.patch('/:groupId/members', [verifyGroup, handleUpdateGroupMember]);
groupRouter.delete('/:groupId/members', [verifyGroup, handleDeleteGroupMember]);
