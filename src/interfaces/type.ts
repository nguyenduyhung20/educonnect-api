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
