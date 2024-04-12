import { Request, Response, NextFunction } from 'express';
import prisma from '../databases/client';

const ROLES = ['teacher', 'student', 'admin', 'parent'];

const verifyFilePublic = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  const role: string = req.body.role || '';

  if (ROLES.includes(role)) {
    next();
    return;
  }
  const fileUrl = req.originalUrl;

  const docu = await prisma.document.findMany({
    where: {
      url: fileUrl
    }
  });

  if (!docu?.[0].public) {
    res.status(403).json({
      message: 'Bạn không có quyền truy cập tài liệu này.'
    });
    return;
  }

  next();
};

export = verifyFilePublic;
