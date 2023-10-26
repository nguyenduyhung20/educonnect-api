import type { ColumnType } from 'kysely';

export type Generated<T> = T extends ColumnType<infer S, infer I, infer U>
  ? ColumnType<S, I | undefined, U>
  : ColumnType<T, T | undefined, T>;

export type InteractType = 'angry' | 'haha' | 'like' | 'love' | 'sad' | 'wow';

export type MemberRole = 'admin' | 'user';

export type MemberStatus = 'active' | 'block' | 'pending';

export type Timestamp = ColumnType<Date, Date | string, Date | string>;

export type UserRole = 'admin' | 'parent' | 'student' | 'teacher' | 'user';

export type UserSex = 'man' | 'other' | 'woman';

export interface Account {
  avatar: string | null;
  create_at: Generated<Timestamp | null>;
  deleted: Generated<boolean | null>;
  id: number;
  pass: string | null;
  update_at: Generated<Timestamp | null>;
  username: string | null;
}

export interface Admin {
  create_at: Generated<Timestamp | null>;
  deleted: Generated<boolean | null>;
  id: number;
  school_id: number | null;
  update_at: Generated<Timestamp | null>;
}

export interface Class {
  create_at: Generated<Timestamp | null>;
  deleted: Generated<boolean | null>;
  id: Generated<number>;
  name: string | null;
  school_id: number | null;
  update_at: Generated<Timestamp | null>;
}

export interface Document {
  create_at: Generated<Timestamp | null>;
  deleted: Generated<boolean | null>;
  document_uuid: Generated<string | null>;
  id: Generated<number>;
  subject_id: number | null;
  teacher_id: number | null;
  title: string | null;
  update_at: Generated<Timestamp | null>;
  url: string | null;
}

export interface Follow {
  create_at: Generated<Timestamp | null>;
  deleted: Generated<boolean | null>;
  followed: number;
  following: number;
  update_at: Generated<Timestamp | null>;
}

export interface Group {
  create_at: Generated<Timestamp | null>;
  deleted: Generated<boolean | null>;
  group_uuid: Generated<string | null>;
  id: Generated<number>;
  meta_title: string | null;
  title: string | null;
  update_at: Generated<Timestamp | null>;
}

export interface GroupPost {
  group_id: number | null;
  id: number;
}

export interface Interact {
  create_at: Generated<Timestamp | null>;
  deleted: Generated<boolean | null>;
  post_id: number;
  type: InteractType | null;
  update_at: Generated<Timestamp | null>;
  user_id: number;
}

export interface Learn {
  class_id: number;
  create_at: Generated<Timestamp | null>;
  deleted: Generated<boolean | null>;
  subject_id: number;
  update_at: Generated<Timestamp | null>;
}

export interface Member {
  create_at: Generated<Timestamp | null>;
  deleted: Generated<boolean | null>;
  group_id: number;
  role: MemberRole | null;
  status: MemberStatus | null;
  update_at: Generated<Timestamp | null>;
  user_id: number;
}

export interface Notification {
  create_at: Generated<Timestamp | null>;
  deleted: Generated<boolean | null>;
  id: Generated<number>;
  message: string | null;
  update_at: Generated<Timestamp | null>;
  user_id: number | null;
}

export interface Of {
  class_id: number;
  create_at: Generated<Timestamp | null>;
  deleted: Generated<boolean | null>;
  student_id: number;
  update_at: Generated<Timestamp | null>;
}

export interface Parent {
  create_at: Generated<Timestamp | null>;
  deleted: Generated<boolean | null>;
  id: number;
  update_at: Generated<Timestamp | null>;
}

export interface Post {
  content: string | null;
  create_at: Generated<Timestamp | null>;
  deleted: Generated<boolean | null>;
  id: Generated<number>;
  parrent_post_id: number | null;
  post_uuid: Generated<string | null>;
  update_at: Generated<Timestamp | null>;
  user_id: number | null;
}

export interface School {
  address: string | null;
  create_at: Generated<Timestamp | null>;
  deleted: Generated<boolean | null>;
  id: Generated<number>;
  name: string | null;
  update_at: Generated<Timestamp | null>;
}

export interface Student {
  create_at: Generated<Timestamp | null>;
  deleted: Generated<boolean | null>;
  id: number;
  parent_id: number | null;
  update_at: Generated<Timestamp | null>;
}

export interface Subject {
  create_at: Generated<Timestamp | null>;
  deleted: Generated<boolean | null>;
  id: Generated<number>;
  name: string | null;
  update_at: Generated<Timestamp | null>;
}

export interface Teacher {
  create_at: Generated<Timestamp | null>;
  deleted: Generated<boolean | null>;
  id: number;
  update_at: Generated<Timestamp | null>;
}

export interface Teaching {
  create_at: Generated<Timestamp | null>;
  deleted: Generated<boolean | null>;
  subject_id: number;
  teacher_id: number;
  update_at: Generated<Timestamp | null>;
}

export interface Transcript {
  create_at: Generated<Timestamp | null>;
  deleted: Generated<boolean | null>;
  fifteen_minutes_score: number | null;
  final_score: number | null;
  id: Generated<number>;
  midterm_score: number | null;
  student_id: number | null;
  subject_id: number | null;
  update_at: Generated<Timestamp | null>;
}

export interface User {
  address: string | null;
  birth: Timestamp | null;
  create_at: Generated<Timestamp>;
  deleted: Generated<boolean>;
  email: string | null;
  id: Generated<number>;
  name: string | null;
  phone: string | null;
  role: UserRole;
  sex: UserSex | null;
  SSN: string | null;
  update_at: Generated<Timestamp>;
  user_uuid: Generated<string>;
}

export interface DB {
  account: Account;
  admin: Admin;
  class: Class;
  document: Document;
  follow: Follow;
  group: Group;
  group_post: GroupPost;
  interact: Interact;
  learn: Learn;
  member: Member;
  notification: Notification;
  of: Of;
  parent: Parent;
  post: Post;
  school: School;
  student: Student;
  subject: Subject;
  teacher: Teacher;
  teaching: Teaching;
  transcript: Transcript;
  user: User;
}
