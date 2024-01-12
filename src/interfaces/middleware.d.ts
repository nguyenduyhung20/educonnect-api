import { GroupModel } from '../models/group.model';
import { UserModel } from '../models/user.model';
import { PostService } from '../services/post.service';

export type UserRequest = Exclude<Awaited<ReturnType<typeof UserModel.getById>>, null>;
export type PostRequest = Exclude<Awaited<ReturnType<typeof PostService.getPost>>, null>;
export type GroupRequest = Exclude<Awaited<ReturnType<typeof GroupModel.getById>>, null>;
