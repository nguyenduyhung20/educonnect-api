import { Prisma } from '@prisma/client';
import prisma from '../databases/client';

export class ElearningModel {
  static async getSchool(userId: number, role: string) {
    switch (role) {
      case 'student':
        return prisma.student.findUnique({
          where: {
            id: userId
          },
          select: {
            school: {
              select: {
                id: true,
                name: true,
                address: true
              }
            }
          }
        });
      case 'admin':
        return prisma.admin.findUnique({
          where: {
            id: userId
          },
          select: {
            school: {
              select: {
                id: true,
                name: true,
                address: true
              }
            }
          }
        });
      case 'teacher':
        return prisma.teacher.findUnique({
          where: {
            id: userId
          },
          select: {
            school: {
              select: {
                id: true,
                name: true,
                address: true
              }
            }
          }
        });
      default:
        return null;
    }
  }

  static async getSubject() {
    return prisma.subject.findMany({
      select: {
        id: true,
        name: true
      }
    });
  }

  static async getByStudentId(userId: number) {
    return prisma.of.findMany({
      where: {
        student_id: userId,
        deleted: false
      },
      select: {
        classroom: {
          select: {
            id: true,
            name: true
          }
        }
      }
    });
  }

  static async getByTeacherId(userId: number) {
    return prisma.learn.findMany({
      where: {
        teacher_id: userId,
        deleted: false
      },
      select: {
        subject: {
          select: {
            id: true,
            name: true
          }
        },
        classroom: {
          select: {
            id: true,
            name: true,
            create_at: true
          }
        }
      },
      orderBy: {
        classroom: {
          create_at: 'desc'
        }
      }
    });
  }

  static async getByAdminId(userId: number) {
    return prisma.admin.findMany({
      where: {
        id: userId,
        deleted: false
      },
      select: {
        school: {
          select: {
            id: true,
            name: true,
            address: true,
            classroom: {
              select: {
                id: true,
                name: true
              },
              orderBy: {
                id: 'asc'
              }
            }
          }
        }
      }
    });
  }

  static async getSubjectByClassId(classId: number) {
    return prisma.learn.findMany({
      where: {
        class_id: classId,
        deleted: false
      },
      select: {
        subject: {
          select: {
            id: true,
            name: true
          }
        },
        teacher: {
          select: {
            user: {
              select: {
                id: true,
                name: true
              }
            }
          }
        }
      },
      orderBy: {
        subject: {
          id: 'asc'
        }
      }
    });
  }

  static async getTeacherByClassId(classId: number) {
    return prisma.learn.findMany({
      where: {
        class_id: classId,
        deleted: false
      },
      select: {
        subject: {
          select: {
            id: true,
            name: true
          }
        },
        teacher: {
          select: {
            user: {
              select: {
                id: true,
                name: true,
                sex: true,
                birthday: true,
                address: true,
                phone: true,
                email: true,
                ssn: true
              }
            }
          }
        }
      },
      orderBy: {
        subject: {
          id: 'asc'
        }
      },
      distinct: ['teacher_id']
    });
  }

  static async getStudentByClassId(classId: number) {
    return prisma.of.findMany({
      where: {
        class_id: classId,
        deleted: false
      },
      select: {
        student: {
          select: {
            parent_id: true,
            user: {
              select: {
                id: true,
                name: true,
                sex: true,
                birthday: true,
                address: true,
                phone: true,
                email: true,
                ssn: true
              }
            }
          }
        }
      },
      orderBy: {
        student: {
          user: {
            id: 'asc'
          }
        }
      }
    });
  }

  static async handleGetDocumentByClassIdAndSubjectId(classId: number, subjectId: number) {
    return prisma.document.findMany({
      where: {
        class_id: classId,
        subject_id: subjectId,
        deleted: false
      },
      select: {
        id: true,
        title: true,
        url: true,
        teacher_id: true,
        public: true,
        document_uuid: true
      },
      orderBy: {
        id: 'asc'
      }
    });
  }

  static async createDocument(classId: number, subjectId: number, userId: number, data: Prisma.documentCreateInput) {
    return await prisma.document.create({
      data: {
        title: data.title,
        url: data.url,
        subject_id: subjectId,
        class_id: classId,
        teacher_id: userId
      }
    });
  }

  static async updateDocument(documentId: number, data: Prisma.documentCreateInput) {
    return await prisma.document.update({
      where: { id: documentId },
      data: {
        title: data.title
      }
    });
  }

  static async deleteDocument(documentId: number) {
    return await prisma.document.update({
      where: { id: documentId },
      data: {
        deleted: true
      }
    });
  }

  static async getParentInSchool(schoolId: number) {
    return prisma.student.findMany({
      where: {
        school_id: schoolId,
        deleted: false
      },
      select: {
        // parent_id: true,
        parent: {
          select: {
            user: {
              select: {
                id: true,
                name: true,
                sex: true,
                birthday: true,
                address: true,
                phone: true,
                email: true,
                ssn: true,
                account: {
                  select: {
                    username: true
                  }
                }
              }
            }
          }
        }
      },
      orderBy: {
        parent: {
          user: {
            id: 'asc'
          }
        }
      },
      distinct: ['parent_id']
    });
  }

  static async getTeacherInSchool(schoolId: number) {
    return prisma.teacher.findMany({
      where: {
        school_id: schoolId,
        deleted: false
      },
      select: {
        user: {
          select: {
            id: true,
            name: true,
            sex: true,
            birthday: true,
            address: true,
            phone: true,
            email: true,
            ssn: true,
            account: {
              select: {
                username: true
              }
            }
          }
        }
      },
      orderBy: {
        user: {
          id: 'asc'
        }
      }
    });
  }

  static async getStudentInSchool(schoolId: number) {
    return prisma.student.findMany({
      where: {
        school_id: schoolId,
        deleted: false
      },
      select: {
        parent: {
          select: {
            user: {
              select: {
                id: true,
                name: true,
                phone: true
              }
            }
          }
        },
        user: {
          select: {
            id: true,
            name: true,
            sex: true,
            birthday: true,
            address: true,
            phone: true,
            email: true,
            ssn: true,
            account: {
              select: {
                username: true
              }
            }
          }
        }
      },
      orderBy: {
        user: {
          id: 'asc'
        }
      }
    });
  }

  static async createClass(data: Prisma.classroomCreateInput, schoolId: number) {
    return await prisma.classroom.create({
      data: {
        name: data.name,
        school_id: schoolId
      }
    });
  }

  static async updateClass(classId: number, data: Prisma.classroomCreateInput) {
    return await prisma.classroom.update({
      where: { id: classId },
      data: {
        name: data.name
      }
    });
  }

  static async deleteClass(classId: number) {
    return await prisma.classroom.update({
      where: { id: classId },
      data: {
        deleted: true
      }
    });
  }

  static async addSubjectToClass(classId: number, data: any) {
    return await prisma.learn.upsert({
      where: {
        class_id_subject_id_teacher_id: {
          class_id: classId,
          teacher_id: data.teacherId,
          subject_id: data.subjectId
        }
      },
      update: {
        deleted: false
      },
      create: {
        class_id: classId,
        teacher_id: data.teacherId,
        subject_id: data.subjectId
      }
    });
  }

  static async updateSubjectToClass(classId: number, subjectId: number, data: any) {
    return await prisma.learn.update({
      where: {
        class_id_subject_id_teacher_id: {
          class_id: classId,
          subject_id: subjectId,
          teacher_id: data.teacherId
        }
      },
      data: {
        teacher_id: data.newTeacherId
      }
    });
  }

  static async deleteSubjectInClass(classId: number, subjectId: number) {
    return await prisma.learn.updateMany({
      where: {
        class_id: classId,
        subject_id: subjectId
      },
      data: {
        deleted: true
      }
    });
  }

  static async addStudentToClass(classId: number, data: any) {
    return await prisma.of.upsert({
      where: {
        student_id_class_id: {
          class_id: classId,
          student_id: data.studentId
        }
      },
      update: {
        deleted: false
      },
      create: {
        class_id: classId,
        student_id: data.studentId
      }
    });
  }

  static async deleteStudentInClass(classId: number, studentId: number) {
    return await prisma.of.update({
      where: {
        student_id_class_id: {
          class_id: classId,
          student_id: studentId
        }
      },
      data: {
        deleted: true
      }
    });
  }

  static async searchUserInSchool(name: string) {
    return await prisma.account.findUnique({
      where: {
        username: name,
        deleted: false
      },
      select: {
        user: {
          select: {
            id: true,
            name: true,
            phone: true,
            role: true,
            address: true,
            sex: true,
            email: true,
            birthday: true,
            ssn: true
          }
        }
      }
    });
  }

  static async createUser(data: any) {
    const res = await prisma.user.create({
      data: {
        name: data.name,
        birthday: data.birthday,
        phone: data.phone,
        email: data.email,
        role: data.userRole,
        sex: data.sex === 'Nam' ? 'male' : 'female',
        ssn: data.ssn,
        address: data.address
      }
    });
    await prisma.account.create({
      data: {
        id: res.id,
        username: data.account,
        password: '123123'
      }
    });
    if (data.userRole === 'teacher') {
      await prisma.teacher.create({
        data: {
          id: res.id,
          school_id: data.schoolId
        }
      });
    } else if (data.userRole === 'student') {
      await prisma.student.create({
        data: {
          id: res.id,
          parent_id: parseInt(data.parentId),
          school_id: data.schoolId
        }
      });
    } else {
      await prisma.parent.create({
        data: {
          id: res.id
        }
      });
    }
    return res;
  }

  static async deleteUser(userId: number) {
    return await prisma.user.update({
      where: {
        id: userId
      },
      data: {
        deleted: true
      }
    });
  }

  static async updateUser(data: any) {
    const res = await prisma.user.update({
      where: {
        id: data.id
      },
      data: {
        name: data.name,
        phone: data.phone,
        ssn: data.ssn,
        address: data.address,
        sex: data.sex === 'Nam' ? 'male' : 'female',
        birthday: data.birthday,
        email: data.email
      }
    });
    if (data.userRole === 'student') {
      await prisma.student.update({
        where: {
          id: res.id
        },
        data: {
          parent_id: parseInt(data.parentId)
        }
      });
    }
    return res;
  }

  static async shareDocument(input: any, userId: number) {
    return await prisma.post.create({
      data: {
        title: input.title,
        content: input.content,
        user_id: userId,
        file_content: input.fileContent
      }
    });
  }

  static async publicDocument(input: string) {
    return await prisma.document.updateMany({
      where: {
        url: input
      },
      data: {
        public: true
      }
    });
  }
}
