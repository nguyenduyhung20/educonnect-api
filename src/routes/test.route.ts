import express from 'express';
import { handleError, handleTest } from '../controllers/test.controller';

export const testRouter = express.Router();

testRouter.get('/', handleTest);
testRouter.get('/error', handleError);
