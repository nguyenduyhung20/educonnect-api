import { PostModel } from '../models/post.model';
import { UserModel } from '../models/user.model';

export type UserRequest = Exclude<Awaited<ReturnType<typeof UserModel.getByUuid>>, null>;
export type PostRequest = Exclude<Awaited<ReturnType<typeof PostModel.getByUuid>>, null>;
