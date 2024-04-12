import { Request, Response, NextFunction } from 'express';

const verifyRole = (roles: string[], req: Request, res: Response, next: NextFunction) => {
  const role: string = req.body.role || '';

  if (!roles.includes(role))
    res.status(401).json({
      message: 'unauthorization'
    });
  else next();
};

export = verifyRole;
