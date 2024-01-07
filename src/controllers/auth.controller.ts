import { NextFunction, Request, Response } from 'express';
import fileUpload, { UploadedFile } from 'express-fileupload';
import { AuthModel } from '../models/auth.model';
import { uploadFile } from '../utils/uploadFile';
import { SUCCESS_RESPONSE } from '../constants/success';
import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';

dotenv.config();

export const handleLogin = async (req: Request, res: Response, next: NextFunction) => {
  const { username, password } = req.body;
  try {
    const account = await AuthModel.login(username, password);

    if (!account) {
      return res.status(401).json({ data: 'Username does not exists' });
    }

    if (account.password !== password) {
      return res.status(401).json({ data: 'Invalid username or password' });
    }

    // Create JWT token
    const token = jwt.sign(
      {
        user_id: account.id,
        role: account.user.role
      },
      process.env.ACCESS_TOKEN_SECRET as string,
      { expiresIn: '1d' }
    );

    const data = {
      id: account.id,
      name: account.user.name,
      role: account.user.role,
      avatar: account.user.avatar
    };

    res
      .cookie('token', `Bearer ${token}`, {
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

// POST account/uuid/:userUuid/follow/following/uuid/:followedUuid
export const handleRegister = async (req: Request, res: Response, next: NextFunction) => {
  const uploadedFiles = req.files?.uploadedFiles as UploadedFile | UploadedFile[];
  let { body } = req;
  try {
    if (uploadedFiles) {
      if (Array.isArray(uploadedFiles)) {
        for (let file of uploadedFiles) {
          body.avatar = await uploadFile(file);
        }
      } else {
        body.avatar = await uploadFile(uploadedFiles);
      }
    }
    await AuthModel.create(body);
    res.status(200).json(SUCCESS_RESPONSE);
  } catch (error) {
    next(error);
  }
};

export const handleLogout = async (req: Request, res: Response, next: NextFunction) => {
  res.clearCookie('token').status(200).json({ data: 'Successfully logged out' });
};
