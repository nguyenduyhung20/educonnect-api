import express from 'express';
import {
  handleCreateTranscript,
  handleDeleteTranscript,
  handleGetTranscriptByStudentId,
  handleGetTranscriptByParentId,
  handleUpdateTranscript
} from '../controllers/transcript.controller';
import { verifyParent } from '../middleware/user.middleware';
export const transcriptRouter = express.Router();

transcriptRouter.get('/', handleGetTranscriptByStudentId);
transcriptRouter.get('/parent', [verifyParent, handleGetTranscriptByParentId]);
transcriptRouter.post('/', [handleCreateTranscript]);
transcriptRouter.patch('/:transcriptId', [handleUpdateTranscript]);
transcriptRouter.delete('/:transcriptId', [handleDeleteTranscript]);
