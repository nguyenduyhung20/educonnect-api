export const interact_type = {
  like: 'like',
  love: 'love',
  haha: 'haha',
  wow: 'wow',
  sad: 'sad',
  angry: 'angry'
} as const;
export type interact_type = (typeof interact_type)[keyof typeof interact_type];
export const member_role = {
  admin: 'admin',
  user: 'user'
} as const;
export type member_role = (typeof member_role)[keyof typeof member_role];
export const member_status = {
  block: 'block',
  active: 'active',
  pending: 'pending'
} as const;
export type member_status = (typeof member_status)[keyof typeof member_status];
export const user_role = {
  admin: 'admin',
  teacher: 'teacher',
  student: 'student',
  parent: 'parent',
  user: 'user'
} as const;
export type user_role = (typeof user_role)[keyof typeof user_role];
export const user_sex = {
  male: 'male',
  female: 'female',
  other: 'other'
} as const;
export type user_sex = (typeof user_sex)[keyof typeof user_sex];
