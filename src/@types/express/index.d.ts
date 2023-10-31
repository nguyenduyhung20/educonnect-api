import { PostRequest, UserRequest } from '../../interfaces/middleware';

export {};

declare global {
  namespace Express {
    export interface Request {
      requestUser: UserRequest;
      requestPost: PostRequest;
    }
  }
}
