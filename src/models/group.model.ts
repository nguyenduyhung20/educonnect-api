import { Prisma, member_role } from '@prisma/client';
import prisma from '../databases/client';

export class GroupModel {
  static async getAll(limit = 20) {
    return prisma.group.findMany({
      take: limit,
      where: {
        deleted: false
      },
      orderBy: {
        create_at: 'desc'
      }
    });
  }

  static async getMostMembers(take = 20) {
    const groups = await prisma.group.findMany({
      include: {
        _count: {
          select: {
            member: true
          }
        }
      },
      orderBy: {
        member: {
          _count: 'desc'
        }
      },
      take: take
    });
    return groups;
  }

  static async getByUuid(groupUuid: string) {
    return prisma.group.findFirst({
      where: {
        group_uuid: groupUuid,
        deleted: false
      }
    });
  }

  static async getById(groupId: number) {
    return prisma.group.findFirst({
      where: {
        id: groupId,
        deleted: false
      }
    });
  }

  static async create(input: Prisma.groupCreateInput) {
    return prisma.group.create({
      data: {
        title: input.title,
        meta_title: input.meta_title
      }
    });
  }

  static async update(id: number, data: Prisma.groupUpdateInput) {
    return prisma.group.update({
      where: { id: id },
      data
    });
  }

  static async delete(groupId: number) {
    return prisma.group.update({
      where: { id: groupId },
      data: { deleted: true }
    });
  }

  static async getAllMemberById(groupId: number, limit = 20) {
    return prisma.group.findUnique({
      where: {
        id: groupId,
        deleted: false
      },
      include: {
        member: {
          take: limit,
          where: {
            deleted: false
          }
        },
        _count: {
          select: {
            member: {
              where: {
                deleted: false
              }
            }
          }
        }
      }
    });
  }

  static async addMember(groupId: number, userId: number, role: string) {
    return prisma.member.create({
      data: {
        user_id: userId,
        group_id: groupId,
        role: role as member_role,
        status: 'active'
      }
    });
  }

  static async updateMember(groupId: number, userId: number, data: Prisma.memberUpdateInput) {
    return prisma.member.update({
      where: {
        user_id_group_id: {
          user_id: userId,
          group_id: groupId
        }
      },
      data
    });
  }

  static async deleteMember(groupId: number, userId: number) {
    return prisma.member.update({
      where: {
        user_id_group_id: {
          user_id: userId,
          group_id: groupId
        }
      },
      data: {
        deleted: true
      }
    });
  }
}
