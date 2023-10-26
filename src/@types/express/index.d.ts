import { UserRepository } from '../../models/user.model';

const userPromise = UserRepository.getById();
type RequestUser = Exclude<Awaited<typeof userPromise>, undefined>;

export {};

declare global {
  namespace Express {
    export interface Request {
      requestUser: RequestUser;
    }
  }
}
