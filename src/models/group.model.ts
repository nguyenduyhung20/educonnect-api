import { $Enums, Prisma, member_role, member_status } from '@prisma/client';
import prisma from '../databases/client';
import e from 'express';

export class GroupModel {
  static async getAll(limit = 20) {
    const results = await prisma.group.findMany({
      take: limit,
      where: {
        deleted: false
      },
      orderBy: {
        create_at: 'desc'
      }
    });
    return results.map((item) => {
      return {
        ...item,
        avatar: item.avatar?.startsWith('http') ? item.avatar : process.env.NEXT_PUBLIC_API_HOST ?? '' + item.avatar,
        background: item.background?.startsWith('http')
          ? item.background
          : (process.env.NEXT_PUBLIC_API_HOST ?? '') + item.background
      };
    });
  }

  static async getGroupsByUserRole(
    userId: number,
    role: Prisma.Enummember_roleNullableFilter<'member'> | $Enums.member_role
  ) {
    const results = await prisma.member.findMany({
      where: {
        user_id: userId,
        role: role,
        deleted: false
      },
      select: {
        group: {
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
                deleted: false,
                status: 'active'
              }
            },
            _count: {
              select: {
                member: {
                  where: {
                    deleted: false,
                    status: 'active'
                  }
                }
              }
            }
          }
        }
      }
    });
    return results.map((item) => {
      const group = item.group;
      return {
        id: group.id,
        title: group.title,
        avatar: group.avatar?.startsWith('http')
          ? group.avatar
          : (process.env.NEXT_PUBLIC_API_HOST ?? '') + group.avatar,
        background: group.background?.startsWith('http')
          ? group.background
          : (process.env.NEXT_PUBLIC_API_HOST ?? '') + group.background,
        metaTitle: group.meta_title,
        createAt: group.create_at,
        memberCount: group._count.member,
        members: group.member.map((item) => {
          return {
            ...item,
            user: {
              ...item.user,
              avatar: item.user.avatar?.startsWith('http')
                ? item.user.avatar
                : (process.env.NEXT_PUBLIC_API_HOST ?? '') + item.user.avatar
            }
          };
        })
      };
    });
  }

  static async getGroupsByUserJoin(userId: number) {
    const results = await prisma.member.findMany({
      where: {
        user_id: userId,
        status: 'active',
        deleted: false
      },
      select: {
        group: {
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
                deleted: false,
                status: 'active'
              }
            },
            _count: {
              select: {
                member: {
                  where: {
                    deleted: false,
                    status: 'active'
                  }
                }
              }
            }
          }
        }
      }
    });
    return results.map((item) => {
      const group = item.group;
      return {
        id: group.id,
        title: group.title,
        avatar: group.avatar?.startsWith('http')
          ? group.avatar
          : (process.env.NEXT_PUBLIC_API_HOST ?? '') + group.avatar,
        background: group.background?.startsWith('http')
          ? group.background
          : (process.env.NEXT_PUBLIC_API_HOST ?? '') + group.background,
        metaTitle: group.meta_title,
        createAt: group.create_at,
        memberCount: group._count.member,
        members: group.member.map((item) => {
          return {
            ...item,
            user: {
              ...item.user,
              avatar: item.user.avatar?.startsWith('http')
                ? item.user.avatar
                : (process.env.NEXT_PUBLIC_API_HOST ?? '') + item.user.avatar
            }
          };
        })
      };
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
            deleted: false,
            status: 'active'
          }
        },
        _count: {
          select: {
            member: {
              where: {
                deleted: false,
                status: 'active'
              }
            }
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
        avatar: group.avatar?.startsWith('http')
          ? group.avatar
          : (process.env.NEXT_PUBLIC_API_HOST ?? '') + group.avatar,
        background: group.background?.startsWith('http')
          ? group.background
          : (process.env.NEXT_PUBLIC_API_HOST ?? '') + group.background,
        metaTitle: group.meta_title,
        createAt: group.create_at,
        memberCount: group._count.member,
        members: group.member.map((item) => {
          return {
            ...item,
            user: {
              ...item.user,
              avatar: item.user.avatar?.startsWith('http')
                ? item.user.avatar
                : (process.env.NEXT_PUBLIC_API_HOST ?? '') + item.user.avatar
            }
          };
        })
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
    const result = await prisma.group.findFirst({
      where: {
        id: groupId,
        deleted: false
      }
    });
    return result
      ? {
          ...result,
          avatar: result.avatar?.startsWith('http')
            ? result.avatar
            : (process.env.NEXT_PUBLIC_API_HOST ?? '') + result.avatar,
          background: result.background?.startsWith('http')
            ? result.background
            : (process.env.NEXT_PUBLIC_API_HOST ?? '') + result.background
        }
      : result;
  }

  static async create(input: Prisma.groupCreateInput, uploadedFiles: string[], userId: number) {
    return prisma.$transaction(async (tx) => {
      const groupCreationResult = await tx.group.create({
        data: {
          title: input.title,
          meta_title: input.meta_title,
          avatar: uploadedFiles[0],
          background: uploadedFiles[1]
        }
      });
      await tx.member.create({
        data: {
          user_id: userId,
          group_id: groupCreationResult.id,
          status: 'active',
          role: 'admin'
        }
      });
      return groupCreationResult;
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

  static async getListApplyingGroup(groupId: number) {
    return prisma.member.findMany({
      where: {
        group_id: groupId,
        status: 'pending',
        deleted: false
      },
      select: {
        role: true,
        status: true,
        create_at: true,
        user: {
          select: {
            id: true,
            name: true,
            avatar: true
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

  static async addMember(groupId: number, userId: number) {
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
        status: 'pending'
      }
    });
    return member;
  }

  static async approveMember(groupId: number, userId: number) {
    const member = await prisma.member.update({
      where: {
        user_id_group_id: {
          group_id: groupId,
          user_id: userId
        }
      },
      data: {
        status: 'active',
        role: 'user'
      }
    });
    return member;
  }

  static async refuseMember(groupId: number, userId: number) {
    const member = await prisma.member.update({
      where: {
        user_id_group_id: {
          group_id: groupId,
          user_id: userId
        }
      },
      data: {
        deleted: true
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
      select: {
        id: true,
        title: true,
        meta_title: true,
        create_at: true,
        member: {
          take: 4,
          select: {
            user: {
              select: {
                id: true,
                name: true
              }
            }
          }
        },
        _count: {
          select: {
            member: true
          }
        }
      },
      take: take
    });

    return groups;
  }

  static async changeAvatar(groupId: number, image: string) {
    return prisma.group.update({
      where: {
        id: groupId
      },
      data: {
        avatar: image
      }
    });
  }
  static async changeBackground(groupId: number, image: string) {
    return prisma.group.update({
      where: {
        id: groupId
      },
      data: {
        background: image
      }
    });
  }
}
