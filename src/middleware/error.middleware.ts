import { NextFunction, Request, Response } from 'express';
import { AppError } from '../config/AppError';

type ErrorResponse = {
  code: number;
  message: string;
  stack?: any;
};

// eslint-disable-next-line @typescript-eslint/no-unused-vars
export const handleError = (err: any, req: Request, res: Response, next: NextFunction) => {
  console.error(err); // Log error stack trace to the console

  let errorResponse: ErrorResponse;

  if (err instanceof AppError) {
    // If the error is an instance of AppError, use its status and message
    res.status(err.statusCode);
    errorResponse = { code: err.statusCode, message: err.message };
  } else {
    // For other types of errors, default to 500 Internal Server Error
    res.status(500);
    errorResponse = { code: err.statusCode, message: 'An unexpected error occurred' };
  }

  // If we're in development mode, include the stack trace in the error response
  if (process.env.NODE_ENV === 'development') {
    errorResponse.stack = err.stack;
  }

  res.json(errorResponse);
};
