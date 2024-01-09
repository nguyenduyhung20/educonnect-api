import { GroupModel } from '../models/group.model';
import { PostModel } from '../models/post.model';
import { UserModel } from '../models/user.model';

export type UserRequest = Exclude<Awaited<ReturnType<typeof UserModel.getById>>, null>;
export type PostRequest = Exclude<Awaited<ReturnType<typeof PostModel.getById>>, null>;
export type GroupRequest = Exclude<Awaited<ReturnType<typeof GroupModel.getById>>, null>;
