import { Prisma, member_role, member_status } from '@prisma/client';
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

  static async getMostMembers(take = 10) {
    const groups = await prisma.group.findMany({
      include: {
        member: {
          take: 4,
          select: {
            role: true,
            status: true,
            user: {
              select: {
                id: true,
                name: true,
                avatar: true
              }
            }
          },
          where: {
            deleted: false
          }
        },
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

    const mappedGroups = groups.map((group) => {
      return {
        id: group.id,
        title: group.title,
        avatar: group.avatar,
        metaTitle: group.meta_title,
        createAt: group.create_at,
        memberCount: group._count.member,
        members: group.member
      };
    });
    return mappedGroups;
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
      data: {
        title: data.title,
        meta_title: data.meta_title
      }
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

  static async getAllMemberByIdAndStatus(groupId: number, status: member_status, limit = 20) {
    return prisma.group.findUnique({
      where: {
        id: groupId,
        deleted: false
      },
      include: {
        member: {
          take: limit,
          where: {
            deleted: false,
            status: status
          },
          orderBy: {
            create_at: 'desc'
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

  static async checkJoinGroup(groupId: number, userId: number) {
    return prisma.member.findUnique({
      where: {
        user_id_group_id: {
          group_id: groupId,
          user_id: userId
        },
        deleted: false
      }
    });
  }

  static async addMember(groupId: number, userId: number, role: string) {
    const member = await prisma.member.upsert({
      where: {
        user_id_group_id: {
          group_id: groupId,
          user_id: userId
        }
      },
      update: {
        deleted: false,
        status: 'pending'
      },
      create: {
        user_id: userId,
        group_id: groupId,
        role: (role as member_role) ?? 'user',
        status: 'active'
      }
    });
    return member;
  }

  static async updateMember(groupId: number, memberId: number, role: member_role, status: member_status) {
    return prisma.member.update({
      where: {
        user_id_group_id: {
          user_id: memberId,
          group_id: groupId
        }
      },
      data: {
        role: role,
        status: status
      }
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

  static async searchGroup(text: string, take = 10) {
    const groups = await prisma.group.findMany({
      where: {
        title: {
          search: text
        },
        deleted: false
      },
      orderBy: {
        _relevance: {
          fields: ['title'],
          search: text,
          sort: 'asc'
        }
      },
      take: take
    });

    const mapGroups = groups.map((group) => {
      return {
        id: group.id,
        title: group.title,
        metaTitle: group.meta_title,
        createAt: group.create_at
      };
    });

    return mapGroups;
  }
}
