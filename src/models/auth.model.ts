import prisma from '../databases/client';
import { RegisterType } from '../interfaces/type';

export class AuthModel {
  static async login(username: string, password: string) {
    return prisma.account.findUnique({
      where: {
        username,
        deleted: false
      },
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
        account: {
          create: [{ 
            username: data.username,
            password: data.password,
            avatar: data.avatar,
            role: data.role
          }]
        }
      },
      include: {
        account: true // Include accounts in the response
      }
    });
  }
}
