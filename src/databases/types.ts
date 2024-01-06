import type { ColumnType } from 'kysely';
export type Generated<T> = T extends ColumnType<infer S, infer I, infer U>
  ? ColumnType<S, I | undefined, U>
  : ColumnType<T, T | undefined, T>;
export type Timestamp = ColumnType<Date, Date | string, Date | string>;

import type { interact_type, member_role, member_status, user_role, user_sex } from './enums';

export type account = {
  id: number;
  username: string | null;
  password: string | null;
  avatar: string | null;
  role: user_role;
  create_at: Generated<Timestamp>;
  update_at: Generated<Timestamp>;
  deleted: Generated<boolean>;
};
export type admin = {
  id: number;
  school_id: number | null;
  create_at: Generated<Timestamp>;
  update_at: Generated<Timestamp>;
  deleted: Generated<boolean>;
};
export type classroom = {
  id: Generated<number>;
  name: string | null;
  create_at: Generated<Timestamp>;
  update_at: Generated<Timestamp>;
  deleted: Generated<boolean>;
  school_id: number | null;
};
export type document = {
  id: Generated<number>;
  title: string | null;
  url: string | null;
  create_at: Generated<Timestamp>;
  update_at: Generated<Timestamp>;
  deleted: Generated<boolean>;
  subject_id: number | null;
  teacher_id: number | null;
  document_uuid: Generated<string>;
};
export type follow = {
  follower_id: number;
  followed_id: number;
  follow_times: Generated<number>;
  create_at: Generated<Timestamp>;
  update_at: Generated<Timestamp>;
  deleted: Generated<boolean>;
};
export type group = {
  id: Generated<number>;
  title: string | null;
  meta_title: string | null;
  create_at: Generated<Timestamp>;
  update_at: Generated<Timestamp>;
  deleted: Generated<boolean>;
  group_uuid: Generated<string>;
};
export type interact = {
  user_id: number;
  post_id: number;
  type: interact_type | null;
  create_at: Generated<Timestamp>;
  update_at: Generated<Timestamp>;
  deleted: Generated<boolean>;
};
export type learn = {
  class_id: number;
  subject_id: number;
  create_at: Generated<Timestamp>;
  update_at: Generated<Timestamp>;
  deleted: Generated<boolean>;
};
export type member = {
  user_id: number;
  group_id: number;
  role: member_role | null;
  status: member_status | null;
  create_at: Generated<Timestamp>;
  update_at: Generated<Timestamp>;
  deleted: Generated<boolean>;
};
export type notification = {
  id: Generated<number>;
  user_id: number;
  message: string | null;
  is_read: Generated<boolean>;
  create_at: Generated<Timestamp>;
  update_at: Generated<Timestamp>;
  deleted: Generated<boolean>;
};
export type of = {
  student_id: number;
  class_id: number;
  create_at: Generated<Timestamp>;
  update_at: Generated<Timestamp>;
  deleted: Generated<boolean>;
};
export type parent = {
  id: number;
  create_at: Generated<Timestamp>;
  update_at: Generated<Timestamp>;
  deleted: Generated<boolean>;
};
export type post = {
  id: Generated<number>;
  title: Generated<string>;
  content: string | null;
  create_at: Generated<Timestamp>;
  update_at: Generated<Timestamp>;
  deleted: Generated<boolean>;
  post_uuid: Generated<string>;
  user_id: number;
  parent_post_id: number | null;
  group_id: number | null;
};
export type school = {
  id: Generated<number>;
  address: string | null;
  name: string | null;
  create_at: Generated<Timestamp>;
  update_at: Generated<Timestamp>;
  deleted: Generated<boolean>;
};
export type student = {
  id: number;
  parent_id: number | null;
  create_at: Generated<Timestamp>;
  update_at: Generated<Timestamp>;
  deleted: Generated<boolean>;
};
export type subject = {
  id: Generated<number>;
  name: string | null;
  create_at: Generated<Timestamp>;
  update_at: Generated<Timestamp>;
  deleted: Generated<boolean>;
};
export type teacher = {
  id: number;
  create_at: Generated<Timestamp>;
  update_at: Generated<Timestamp>;
  deleted: Generated<boolean>;
};
export type teaching = {
  subject_id: number;
  teacher_id: number;
  create_at: Generated<Timestamp>;
  update_at: Generated<Timestamp>;
  deleted: Generated<boolean>;
};
export type transcript = {
  id: Generated<number>;
  fifteen_minutes_score: number | null;
  midterm_score: number | null;
  final_score: number | null;
  create_at: Generated<Timestamp>;
  update_at: Generated<Timestamp>;
  deleted: Generated<boolean>;
  student_id: number | null;
  subject_id: number | null;
};
export type user = {
  id: Generated<number>;
  address: string | null;
  name: string | null;
  phone: string | null;
  birthday: Timestamp | null;
  email: string | null;
  ssn: string | null;
  sex: user_sex | null;
  create_at: Generated<Timestamp>;
  update_at: Generated<Timestamp>;
  deleted: Generated<boolean>;
  user_uuid: Generated<string>;
};
export type DB = {
  account: account;
  admin: admin;
  classroom: classroom;
  document: document;
  follow: follow;
  group: group;
  interact: interact;
  learn: learn;
  member: member;
  notification: notification;
  of: of;
  parent: parent;
  post: post;
  school: school;
  student: student;
  subject: subject;
  teacher: teacher;
  teaching: teaching;
  transcript: transcript;
  user: user;
};
