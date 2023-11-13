import { ERROR_CODE } from '../constants/error';

export class AppError extends Error {
  statusCode: number;

  constructor(statusCode: number, message: keyof typeof ERROR_CODE) {
    super(message);
    this.statusCode = statusCode;

    // This line is needed to correctly capture the stack trace
    Error.captureStackTrace(this, this.constructor);
  }
}

export class CustomError extends Error {
  statusCode: number;

  constructor(statusCode: number, message: string) {
    super(message);
    this.statusCode = statusCode;

    // This line is needed to correctly capture the stack trace
    Error.captureStackTrace(this, this.constructor);
  }
}
