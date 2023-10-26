import { db } from '../databases/kysely';

export class UserRepository {
  static async getById(userId: number) {
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
      .where(({ eb, and }) => and([eb('id', '=', userId), eb('deleted', '=', false)]))
      .executeTakeFirst();
  }

  static async getByUuid(userUuid: string) {
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
      .where(({ eb, and }) => and([eb('user_uuid', '=', userUuid), eb('deleted', '=', false)]))
      .executeTakeFirst();
  }

  static async updateByUuid(userUuid: string, data: any) {
    return db.updateTable('user').set(data).where('user_uuid', '=', userUuid).executeTakeFirst();
  }

  static async deleteByUuid(userUuid: string) {
    return db.updateTable('user').set({ deleted: true }).where('user_uuid', '=', userUuid).executeTakeFirst();
  }
}
