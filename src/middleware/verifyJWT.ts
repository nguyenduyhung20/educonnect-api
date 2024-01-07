import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';

dotenv.config();

const verifyJWT = (req: Request, res: Response, next: NextFunction): void => {
  const auth: string | string[] | undefined =
    req.headers.authorization || req.headers.Authorization || req.cookies.token;

  if (!auth || auth === '' || (!Array.isArray(auth) && !auth.startsWith('Bearer'))) {
    res.status(401).json({
      result: 'unauthorization'
    });
  } else {
    const accessToken: string = Array.isArray(auth) ? auth[0].split(' ')[1] : auth.split(' ')[1];

    jwt.verify(accessToken, process.env.ACCESS_TOKEN_SECRET as string, (err, decoded) => {
      if (err) {
        const error: string = err.toString();
        if (error.includes('expired')) {
          res.status(402).json({
            result: 'token expire'
          });
        } else {
          res.status(401).json({
            result: 'unauthorization'
          });
        }
      } else {
        req.body.user_id = (decoded as { user_id: number }).user_id;
        req.body.role = (decoded as { role: string }).role;
        next();
      }
    });
  }
};

export = verifyJWT;
