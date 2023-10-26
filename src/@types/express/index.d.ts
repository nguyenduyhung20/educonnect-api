import { RequestUser } from '../../interfaces/user';

export {};

declare global {
  namespace Express {
    export interface Request {
      requestUser: RequestUser;
    }
  }
}
