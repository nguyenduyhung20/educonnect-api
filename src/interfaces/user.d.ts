import { UserRepository } from '../models/user.model';

export type RequestUser = Exclude<Awaited<ReturnType<typeof UserRepository.getByUuid>>, undefined>;
export type UserCreateInput = Pick<
  RequestUser,
  'address' | 'birth' | 'email' | 'name' | 'phone' | 'role' | 'sex' | 'SSN'
>;
export type UserUpdateInput = Pick<RequestUser, 'address' | 'birth' | 'email' | 'name' | 'phone' | 'sex' | 'SSN'>;
