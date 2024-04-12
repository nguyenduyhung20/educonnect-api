import type { user_role, user_sex } from '../databases/enums';

export type RegisterType = {
  id?: number;
  address?: string;
  name?: string;
  phone?: string;
  birthday?: Date | string;
  email?: string;
  ssn?: string;
  sex?: user_sex;
  username?: string;
  password?: string;
  avatar?: string;
  role: user_role;
};

export type ArrayType<T> = T extends (infer U)[] ? U : never;

export type Prettify<T> = {
  [K in keyof T]: T[K];
} & unknown;
export type GetPostsByListIdArgs = {
  postIdList: number[];
  userIdRequesting: number;
};
export type GetPostsByListIdInput<T> = {
  args: GetPostsByListIdArgs;
  select: T;
};
export type GetPostListConfig = {
  /**
   * Default: true
   */
  isComment?: boolean;
  /**
   * Default: true
   */
  isGroup?: boolean;
  /**
   * Default: true
   */
  isFileContent?: boolean;
  /**
   * Default: true
   */
  isSummarize?: boolean;
  /**
   * Default: undefined
   */
  commentLimit?: number;
};
