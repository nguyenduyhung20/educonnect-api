import express from 'express';
import {
  handleLogin,
  handleRegister,
  handleLogout
} from '../controllers/auth.controller';

export const authRouter = express.Router();

authRouter.post('/login', [handleLogin]);
authRouter.post('/logout', [handleLogout]);
authRouter.post('/register', [handleRegister]);
