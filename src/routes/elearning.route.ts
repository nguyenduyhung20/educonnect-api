import express from 'express';
import { transcriptRouter } from './transcript.route';
import { calendarRouter } from './calendar.route';
import {
  handleGetClassById,
  handleGetSubjectByClassId,
  handleGetDocumentByClassIdAndSubjectId,
  handleGetTeacherByClassId,
  handleGetStudentByClassId,
  handleGetParentInSchool,
  handleGetStudentInSchool,
  handleGetTeacherInSchool,
  handleCreateClass,
  handleUpdateClassById,
  handleDeleteClassById,
  handleCreateSubjectToClass,
  handleUpdateSubjectToClass,
  handleRemoveSubjectToClass,
  handleUpdateDocumentByClassIdAndSubjectId,
  handleDeleteDocumentByClassIdAndSubjectId,
  handleCreateDocumentByClassIdAndSubjectId,
  handleCreateStudentToClass,
  handleRemoveStudentToClass,
  handleSearchUser,
  handleGetSubject,
  handleDeleteUser,
  handleCreateUser,
  handleUpdateUser,
  handleGetSchool,
  handleShareDocument
} from '../controllers/elearning.controller';
import { verifyAdmin } from '../middleware/user.middleware';
import verifyRole from '../middleware/verifyRole';
export const elearningRouter = express.Router();

elearningRouter.use('/transcript', [transcriptRouter]);
elearningRouter.use('/calendar', [calendarRouter]);

// Class
elearningRouter.get('/class', handleGetClassById);
elearningRouter.get('/class/:classId/teacher', handleGetTeacherByClassId);
elearningRouter.get('/class/:classId/student', handleGetStudentByClassId);
elearningRouter.get('/class/:classId/subject', handleGetSubjectByClassId);

elearningRouter.post('/class', [verifyAdmin, handleCreateClass]);
elearningRouter.patch('/class/:classId', [verifyAdmin, handleUpdateClassById]);
elearningRouter.delete('/class/:classId', [verifyAdmin, handleDeleteClassById]);

elearningRouter.post('/class/:classId/subject', [verifyAdmin, handleCreateSubjectToClass]);
elearningRouter.patch('/class/:classId/subject/:subjectId', [verifyAdmin, handleUpdateSubjectToClass]);
elearningRouter.delete('/class/:classId/subject/:subjectId', [verifyAdmin, handleRemoveSubjectToClass]);

// Student in class
elearningRouter.post('/class/:classId/student', [verifyAdmin, handleCreateStudentToClass]);
elearningRouter.delete('/class/:classId/student/:studentId', [verifyAdmin, handleRemoveStudentToClass]);
elearningRouter.get('/subject', handleGetSubject);

// Document
elearningRouter.get('/class/:classId/subject/:subjectId/document', handleGetDocumentByClassIdAndSubjectId);
elearningRouter.post('/class/:classId/subject/:subjectId/document', handleCreateDocumentByClassIdAndSubjectId);
elearningRouter.patch('/document/:documentId', handleUpdateDocumentByClassIdAndSubjectId);
elearningRouter.delete('/document/:documentId', handleDeleteDocumentByClassIdAndSubjectId);

// School
elearningRouter.get('/school', [handleGetSchool]);
elearningRouter.get('/school/student', [verifyAdmin, handleGetStudentInSchool]);
elearningRouter.get('/school/teacher', [verifyAdmin, handleGetTeacherInSchool]);
elearningRouter.get('/school/parent', [verifyAdmin, handleGetParentInSchool]);
elearningRouter.get('/school/search/user', [verifyAdmin, handleSearchUser]);
elearningRouter.use('/share-document', verifyRole.bind(null, ['teacher', 'admin']), handleShareDocument);

// User
elearningRouter.delete('/user/:userId', [verifyAdmin, handleDeleteUser]);
elearningRouter.patch('/user', [verifyAdmin, handleUpdateUser]);
elearningRouter.post('/user', [verifyAdmin, handleCreateUser]);
