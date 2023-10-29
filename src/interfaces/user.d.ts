import { UserModel } from '../models/user.model';

export type RequestUser = Exclude<Awaited<ReturnType<typeof UserModel.getByUuid>>, null>;
