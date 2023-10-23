import express from 'express';
import { handleError, handleGetAllUsers } from '../controllers/test.controller';

export const testRouter = express.Router();

testRouter.get('/', handleGetAllUsers);
testRouter.get('/error', handleError);
