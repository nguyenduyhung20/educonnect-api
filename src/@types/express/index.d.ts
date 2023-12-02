import { PostRequest, UserRequest, GroupRequest } from '../../interfaces/middleware';

export {};

declare global {
  namespace Express {
    export interface Request {
      requestUser: UserRequest;
      requestPost: PostRequest;
      requestGroup: GroupRequest;
      requestFollowed: UserRequest;
    }
  }
}
