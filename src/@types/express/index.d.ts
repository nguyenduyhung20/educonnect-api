import { UserRepository } from '../../models/user.model';

export {};
type RequestUser = Exclude<Awaited<ReturnType<typeof UserRepository.getByUuid>>, undefined>;

declare global {
  namespace Express {
    export interface Request {
      requestUser: RequestUser;
    }
  }
}
