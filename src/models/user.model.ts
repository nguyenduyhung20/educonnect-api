import { Prisma } from '@prisma/client';
import { db } from '../databases/kysely';
import prisma from '../config/client';

export class UserRepository {
  static async getAll(limit?: number) {
    return db
      .selectFrom('user')
      .select([
        'id',
        'address',
        'name',
        'phone',
        'birth',
        'email',
        'SSN',
        'sex',
        'user_uuid',
        'role',
        'deleted',
        'create_at',
        'update_at'
      ])
      .limit(limit ?? 20)
      .execute();
  }

  static async getById(id: number) {
    return db
      .selectFrom('user')
      .select([
        'id',
        'address',
        'name',
        'phone',
        'birth',
        'email',
        'SSN',
        'sex',
        'user_uuid',
        'role',
        'deleted',
        'create_at',
        'update_at'
      ])
      .where(({ eb, and }) => and([eb('id', '=', id), eb('deleted', '=', false)]))
      .executeTakeFirst();
  }

  static async getByUuid(uuid: string) {
    return db
      .selectFrom('user')
      .select([
        'id',
        'address',
        'name',
        'phone',
        'birth',
        'email',
        'SSN',
        'sex',
        'user_uuid',
        'role',
        'deleted',
        'create_at',
        'update_at'
      ])
      .where(({ eb, and }) => and([eb('user_uuid', '=', uuid), eb('deleted', '=', false)]))
      .executeTakeFirst();
  }

  static async prismaGet(uuid: string) {
    return prisma.user.findFirst({
      where: {
        user_uuid: uuid
      }
    });
  }

  static async create(data: Prisma.userCreateInput) {
    return db.insertInto('user').values(data).executeTakeFirst();
  }

  static async update(uuid: string, data: Prisma.userCreateInput) {
    return db.updateTable('user').set(data).where('user_uuid', '=', uuid).executeTakeFirst();
  }

  static async delete(uuid: string) {
    return db.updateTable('user').set({ deleted: true }).where('user_uuid', '=', uuid).executeTakeFirst();
  }
}
