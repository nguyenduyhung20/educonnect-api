import { Prisma } from '@prisma/client';
import prisma from '../databases/client';

export class TranscriptModel {
  static async getByStudentId(userId: number) {
    return prisma.transcript.findMany({
      where: {
        student_id: userId,
        deleted: false
      },
      select: {
        id: true,
        fifteen_minutes_score: true,
        midterm_score: true,
        final_score: true,
        semester: true,
        student: {
          select: {
            user: {
              select: {
                name: true
              }
            }
          }
        },
        subject: {
          select: {
            name: true
          }
        }
      }
    });
  }

  static async getByParentId(userId: number) {
    return prisma.student.findMany({
      where: {
        parent_id: userId,
        deleted: false
      },
      select: {
        id: true,
        transcript: {
          select: {
            id: true,
            fifteen_minutes_score: true,
            midterm_score: true,
            final_score: true,
            semester: true,
            subject: {
              select: {
                name: true
              }
            }
          }
        },
        user: {
          select: {
            name: true
          }
        }
      }
    });
  }

  static async delete(id: number) {
    return prisma.transcript.update({
      where: { id: id },
      data: {
        deleted: true
      }
    });
  }

  static async update(id: number, data: Prisma.transcriptCreateInput) {
    return prisma.transcript.update({
      where: { id: id },
      data: {
        fifteen_minutes_score: data.fifteen_minutes_score,
        midterm_score: data.midterm_score,
        final_score: data.final_score,
        semester: data.semester,
        student: data.student,
        subject: data.subject
      }
    });
  }

  static async create(data: Prisma.transcriptCreateInput) {
    return await prisma.transcript.create({
      data: {
        fifteen_minutes_score: data.fifteen_minutes_score,
        midterm_score: data.midterm_score,
        final_score: data.final_score,
        semester: data.semester,
        student: data.student,
        subject: data.subject
      }
    });
  }
}
