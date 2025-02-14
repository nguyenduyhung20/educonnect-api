import { NextFunction, Request, Response } from 'express';
import { UploadedFile } from 'express-fileupload';
import { AuthModel } from '../models/auth.model';
import { uploadFile } from '../utils/uploadFile';
import { SUCCESS_RESPONSE } from '../constants/success';
import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';

dotenv.config();

export const handleLogin = async (req: Request, res: Response, next: NextFunction) => {
  const { username, password } = req.body;
  try {
    const account = await AuthModel.login(username);

    if (!account) {
      return res.status(401).json({ message: 'Username does not exists' });
    }

    if (account.password !== password) {
      return res.status(401).json({ message: 'Invalid username or password' });
    }

    // Create JWT token
    const token = jwt.sign(
      {
        userId: account.id,
        role: account.user.role
      },
      process.env.ACCESS_TOKEN_SECRET as string,
      { expiresIn: '1d' }
    );

    const data = {
      id: account.id,
      name: account.user.name,
      role: account.user.role,
      avatar: account.user.avatar?.startsWith('http')
        ? account.user.avatar
        : (process.env.NEXT_PUBLIC_API_HOST ?? '') + account.user.avatar
    };

    res
      .cookie('Token', `Bearer ${token}`, {
        httpOnly: true,
        maxAge: 86400000 // 24 hour
        // secure: process.env.NODE_ENV === 'production',
      })
      .status(200)
      .json({ data, token });
  } catch (error) {
    next(error);
  }
};

// POST account/
export const handleRegister = async (req: Request, res: Response, next: NextFunction) => {
  const uploadedFiles = req.files?.uploadedFiles as UploadedFile | UploadedFile[];
  const { body } = req;
  try {
    if (uploadedFiles) {
      if (Array.isArray(uploadedFiles)) {
        for (const file of uploadedFiles) {
          body.avatar = await uploadFile(file);
        }
      } else {
        body.avatar = await uploadFile(uploadedFiles);
      }
    }
    const result = await AuthModel.create(body);
    const data = {
      id: result.id,
      name: result.name,
      role: result.role,
      avatar: result.avatar
    };
    const token = jwt.sign({ userId: data.id, role: data.role }, process.env.ACCESS_TOKEN_SECRET as string, {
      expiresIn: '1d'
    });
    return res
      .cookie('Token', `Bearer ${token}`, {
        httpOnly: true,
        maxAge: 86400000
      })
      .status(200)
      .json({ data, token });
  } catch (error) {
    next(error);
  }
};

export const handleLogout = async (req: Request, res: Response) => {
  res.clearCookie('token').status(200).json({ data: 'Successfully logged out' });
};
