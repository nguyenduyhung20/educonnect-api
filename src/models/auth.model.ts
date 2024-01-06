import prisma from '../databases/client';
import { RegisterType } from '../interfaces/type';

export class AuthModel {
  static async login(username: string, password: string) {
    return prisma.account.findUnique({
      where: {
        username,
        deleted: false
      },
      include: {
        user: true
      }
    });
  }

  static async create(data: RegisterType) {
    return await prisma.user.create({
      data: {
        address: data.address,
        name: data.name,
        phone: data.phone,
        birthday: data.birthday,
        email: data.email,
        ssn: data.ssn,
        sex: data.sex,
        avatar: data.avatar,
        role: 'user',
        account: {
          create: {
            username: data.username,
            password: data.password
          }
        }
      }
    });
  }
}
