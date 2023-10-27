import { UserRepository } from '../models/user.model';

export type RequestUser = Exclude<Awaited<ReturnType<typeof UserRepository.getByUuid>>, null>;
