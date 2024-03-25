import { NextFunction, Request, Response } from 'express';
import { ElearningModel } from '../models/elearning.model';
import { UploadedFile } from 'express-fileupload';
import { uploadFile } from '../utils/uploadFile';

export const handleGetClassById = async (req: Request, res: Response, next: NextFunction) => {
  const { userId, role } = req.body;
  try {
    let calendar;
    switch (role) {
      case 'teacher':
        calendar = await ElearningModel.getByTeacherId(userId);
        break;
      case 'admin':
        calendar = await ElearningModel.getByAdminId(userId);
        break;
      default:
        calendar = await ElearningModel.getByStudentId(userId);
    }

    res.status(200).json({ data: calendar });
  } catch (error) {
    next(error);
  }
};

export const handleGetSubject = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const calendar = await ElearningModel.getSubject();
    res.status(200).json({ data: calendar });
  } catch (error) {
    next(error);
  }
};

export const handleGetSubjectByClassId = async (req: Request, res: Response, next: NextFunction) => {
  const classId = parseInt(req.params.classId);
  try {
    const calendar = await ElearningModel.getSubjectByClassId(classId);
    res.status(200).json({ data: calendar });
  } catch (error) {
    next(error);
  }
};

export const handleGetTeacherByClassId = async (req: Request, res: Response, next: NextFunction) => {
  const classId = parseInt(req.params.classId);
  try {
    const calendar = await ElearningModel.getTeacherByClassId(classId);
    res.status(200).json({ data: calendar });
  } catch (error) {
    next(error);
  }
};

export const handleGetStudentByClassId = async (req: Request, res: Response, next: NextFunction) => {
  const classId = parseInt(req.params.classId);
  try {
    const calendar = await ElearningModel.getStudentByClassId(classId);
    res.status(200).json({ data: calendar });
  } catch (error) {
    next(error);
  }
};

export const handleGetDocumentByClassIdAndSubjectId = async (req: Request, res: Response, next: NextFunction) => {
  const classId = parseInt(req.params.classId);
  const subjectId = parseInt(req.params.subjectId);
  try {
    const returnData = await ElearningModel.handleGetDocumentByClassIdAndSubjectId(classId, subjectId);
    returnData.forEach((item) => {
      item.url = item.url?.startsWith('http')
        ? item.url
        : (process.env.NEXT_PUBLIC_API_HOST || 'http://localhost:4001') + item.url;
    });
    res.status(200).json({ data: returnData });
  } catch (error) {
    next(error);
  }
};

export const handleCreateDocumentByClassIdAndSubjectId = async (req: Request, res: Response, next: NextFunction) => {
  const classId = parseInt(req.params.classId);
  const subjectId = parseInt(req.params.subjectId);
  const userId = req.body.userId;
  const data = req.body;
  const uploadedFile = req.files?.uploadedFile as UploadedFile;
  try {
    if (uploadedFile) {
      const result = await uploadFile(uploadedFile);
      data.url = result;
      const calendar = await ElearningModel.createDocument(classId, subjectId, userId, data);
      return res.status(200).json({ data: calendar });
    } else {
      return res.status(400).json({ message: 'File is empty' });
    }
  } catch (error) {
    next(error);
  }
};

export const handleUpdateDocumentByClassIdAndSubjectId = async (req: Request, res: Response, next: NextFunction) => {
  const documentId = parseInt(req.params.documentId);
  const data = req.body;
  try {
    const calendar = await ElearningModel.updateDocument(documentId, data);
    res.status(200).json({ data: calendar });
  } catch (error) {
    next(error);
  }
};

export const handleDeleteDocumentByClassIdAndSubjectId = async (req: Request, res: Response, next: NextFunction) => {
  const documentId = parseInt(req.params.documentId);
  try {
    const calendar = await ElearningModel.deleteDocument(documentId);
    res.status(200).json({ data: calendar });
  } catch (error) {
    next(error);
  }
};

export const handleGetParentInSchool = async (req: Request, res: Response, next: NextFunction) => {
  const schoolId = parseInt(req.body.schoolId);
  try {
    const parents = await ElearningModel.getParentInSchool(schoolId);
    res.status(200).json({ data: parents.map((item) => item.parent?.user) });
  } catch (error) {
    next(error);
  }
};

export const handleGetTeacherInSchool = async (req: Request, res: Response, next: NextFunction) => {
  const schoolId = parseInt(req.body.schoolId);
  try {
    const teachers = await ElearningModel.getTeacherInSchool(schoolId);
    res.status(200).json({ data: teachers.map((item) => item.user) });
  } catch (error) {
    next(error);
  }
};

export const handleGetStudentInSchool = async (req: Request, res: Response, next: NextFunction) => {
  const schoolId = parseInt(req.body.schoolId);
  try {
    const students = await ElearningModel.getStudentInSchool(schoolId);
    res.status(200).json({
      data: students.map((item) => {
        return {
          ...item.user,
          parentId: item.parent?.user.id,
          parentName: item.parent?.user.name,
          parentPhone: item.parent?.user.phone
        };
      })
    });
  } catch (error) {
    next(error);
  }
};

export const handleCreateClass = async (req: Request, res: Response, next: NextFunction) => {
  const data = req.body;
  try {
    const result = await ElearningModel.createClass(data, data.schoolId);
    res.status(200).json({ data: result });
  } catch (error) {
    next(error);
  }
};

export const handleUpdateClassById = async (req: Request, res: Response, next: NextFunction) => {
  const classId = parseInt(req.params.classId);
  const data = req.body;

  try {
    const result = await ElearningModel.updateClass(classId, data);
    res.status(200).json({ data: result });
  } catch (error) {
    next(error);
  }
};

export const handleDeleteClassById = async (req: Request, res: Response, next: NextFunction) => {
  const classId = parseInt(req.params.classId);
  try {
    const result = await ElearningModel.deleteClass(classId);
    res.status(200).json({ data: result });
  } catch (error) {
    next(error);
  }
};

export const handleCreateSubjectToClass = async (req: Request, res: Response, next: NextFunction) => {
  const classId = parseInt(req.params.classId);
  const data = req.body;

  try {
    const result = await ElearningModel.addSubjectToClass(classId, data);
    res.status(200).json({ data: result });
  } catch (error) {
    next(error);
  }
};

export const handleUpdateSubjectToClass = async (req: Request, res: Response, next: NextFunction) => {
  const classId = parseInt(req.params.classId);
  const subjectId = parseInt(req.params.subjectId);
  const data = req.body;

  try {
    const result = await ElearningModel.updateSubjectToClass(classId, subjectId, data);
    res.status(200).json({ data: result });
  } catch (error) {
    next(error);
  }
};

export const handleRemoveSubjectToClass = async (req: Request, res: Response, next: NextFunction) => {
  const classId = parseInt(req.params.classId);
  const subjectId = parseInt(req.params.subjectId);
  try {
    const result = await ElearningModel.deleteSubjectInClass(classId, subjectId);
    res.status(200).json({ data: result });
  } catch (error) {
    next(error);
  }
};

export const handleCreateStudentToClass = async (req: Request, res: Response, next: NextFunction) => {
  const classId = parseInt(req.params.classId);
  const data = req.body;

  try {
    const result = await ElearningModel.addStudentToClass(classId, data);
    res.status(200).json({ data: result });
  } catch (error) {
    next(error);
  }
};

export const handleRemoveStudentToClass = async (req: Request, res: Response, next: NextFunction) => {
  const classId = parseInt(req.params.classId);
  const studentId = parseInt(req.params.studentId);
  try {
    const result = await ElearningModel.deleteStudentInClass(classId, studentId);
    res.status(200).json({ data: result });
  } catch (error) {
    next(error);
  }
};

export const handleSearchUser = async (req: Request, res: Response, next: NextFunction) => {
  const { name } = req.query;
  try {
    const result = await ElearningModel.searchUserInSchool(name as string);
    res.status(200).json({ data: result });
  } catch (error) {
    next(error);
  }
};

export const handleCreateUser = async (req: Request, res: Response, next: NextFunction) => {
  const data = req.body;
  try {
    const result = await ElearningModel.createUser(data);
    res.status(200).json({ data: result });
  } catch (error) {
    next(error);
  }
};

export const handleDeleteUser = async (req: Request, res: Response, next: NextFunction) => {
  const userId = parseInt(req.params.userId);
  try {
    const result = await ElearningModel.deleteUser(userId);
    res.status(200).json({ data: result });
  } catch (error) {
    next(error);
  }
};

export const handleUpdateUser = async (req: Request, res: Response, next: NextFunction) => {
  const data = req.body;
  try {
    const result = await ElearningModel.updateUser(data);
    res.status(200).json({ data: result });
  } catch (error) {
    next(error);
  }
};
