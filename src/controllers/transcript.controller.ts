import { NextFunction, Request, Response } from 'express';
import { TranscriptModel } from '../models/transcript.model';

export const handleGetTranscriptByStudentId = async (req: Request, res: Response, next: NextFunction) => {
  const { userId } = req.body;
  try {
    const transcripts = await TranscriptModel.getByStudentId(userId);
    const transcriptMapped = {
      id: userId,
      studentName: transcripts?.[0].student?.user.name,
      transcript: [
        {
          label: 'Điểm tổng kết kì 1 lớp 10',
          scores: [] as any,
          sum: 0
        },
        {
          label: 'Điểm tổng kết kì 2 lớp 10',
          scores: [] as any,
          sum: 0
        },
        {
          label: 'Điểm tổng kết kì 1 lớp 11',
          scores: [] as any,
          sum: 0
        },
        {
          label: 'Điểm tổng kết kì 2 lớp 11',
          scores: [] as any,
          sum: 0
        },
        {
          label: 'Điểm tổng kết kì 1 lớp 12',
          scores: [] as any,
          sum: 0
        },
        {
          label: 'Điểm tổng kết kì 2 lớp 12',
          scores: [] as any,
          sum: 0
        }
      ]
    };
    transcripts.forEach((transcriptEle) => {
      const score = {
        id: transcriptEle.id,
        fifteen_minutes_score: transcriptEle.fifteen_minutes_score,
        midterm_score: transcriptEle.midterm_score,
        final_score: transcriptEle.final_score,
        gpa:
          ((transcriptEle.final_score ? transcriptEle.final_score : 0) * 2 +
            (transcriptEle.midterm_score ? transcriptEle.midterm_score : 0) * 2 +
            (transcriptEle.fifteen_minutes_score ? transcriptEle.fifteen_minutes_score : 0)) /
          5,
        semester: transcriptEle.semester,
        subjectName: transcriptEle.subject?.name
      };
      if (transcriptEle.subject?.name?.endsWith('10') && transcriptEle?.semester == '1') {
        transcriptMapped.transcript[0].scores.push(score);
        transcriptMapped.transcript[0].sum += score.gpa;
      }
      if (transcriptEle.subject?.name?.endsWith('10') && transcriptEle?.semester == '2') {
        transcriptMapped.transcript[1].scores.push(score);
        transcriptMapped.transcript[1].sum += score.gpa;
      }
      if (transcriptEle.subject?.name?.endsWith('11') && transcriptEle?.semester == '1') {
        transcriptMapped.transcript[2].scores.push(score);
        transcriptMapped.transcript[2].sum += score.gpa;
      }
      if (transcriptEle.subject?.name?.endsWith('11') && transcriptEle?.semester == '2') {
        transcriptMapped.transcript[3].scores.push(score);
        transcriptMapped.transcript[3].sum += score.gpa;
      }
      if (transcriptEle.subject?.name?.endsWith('12') && transcriptEle?.semester == '1') {
        transcriptMapped.transcript[4].scores.push(score);
        transcriptMapped.transcript[4].sum += score.gpa;
      }
      if (transcriptEle.subject?.name?.endsWith('12') && transcriptEle?.semester == '2') {
        transcriptMapped.transcript[5].scores.push(score);
        transcriptMapped.transcript[5].sum += score.gpa;
      }
    });
    res.status(200).json({ data: [transcriptMapped] });
  } catch (error) {
    next(error);
  }
};

export const handleGetTranscriptByParentId = async (req: Request, res: Response, next: NextFunction) => {
  const { userId } = req.body;
  try {
    const transcripts = await TranscriptModel.getByParentId(userId);
    const transcriptMapped = transcripts.map((item) => {
      const transcriptItem = {
        id: item.id,
        studentName: item.user.name,
        transcript: [
          {
            label: 'Điểm tổng kết kì 1 lớp 10',
            scores: [] as any,
            sum: 0
          },
          {
            label: 'Điểm tổng kết kì 2 lớp 10',
            scores: [] as any,
            sum: 0
          },
          {
            label: 'Điểm tổng kết kì 1 lớp 11',
            scores: [] as any,
            sum: 0
          },
          {
            label: 'Điểm tổng kết kì 2 lớp 11',
            scores: [] as any,
            sum: 0
          },
          {
            label: 'Điểm tổng kết kì 1 lớp 12',
            scores: [] as any,
            sum: 0
          },
          {
            label: 'Điểm tổng kết kì 2 lớp 12',
            scores: [] as any,
            sum: 0
          }
        ]
      };
      item.transcript.forEach((transcriptEle) => {
        const score = {
          id: transcriptEle.id,
          fifteen_minutes_score: transcriptEle.fifteen_minutes_score,
          midterm_score: transcriptEle.midterm_score,
          final_score: transcriptEle.final_score,
          gpa:
            ((transcriptEle.final_score ? transcriptEle.final_score : 0) * 2 +
              (transcriptEle.midterm_score ? transcriptEle.midterm_score : 0) * 2 +
              (transcriptEle.fifteen_minutes_score ? transcriptEle.fifteen_minutes_score : 0)) /
            5,
          semester: transcriptEle.semester,
          subjectName: transcriptEle.subject?.name
        };
        if (transcriptEle.subject?.name?.endsWith('10') && transcriptEle?.semester == '1') {
          transcriptItem.transcript[0].scores.push(score);
          transcriptItem.transcript[0].sum += score.gpa;
        }
        if (transcriptEle.subject?.name?.endsWith('10') && transcriptEle?.semester == '2') {
          transcriptItem.transcript[1].scores.push(score);
          transcriptItem.transcript[1].sum += score.gpa;
        }
        if (transcriptEle.subject?.name?.endsWith('11') && transcriptEle?.semester == '1') {
          transcriptItem.transcript[2].scores.push(score);
          transcriptItem.transcript[2].sum += score.gpa;
        }
        if (transcriptEle.subject?.name?.endsWith('11') && transcriptEle?.semester == '2') {
          transcriptItem.transcript[3].scores.push(score);
          transcriptItem.transcript[3].sum += score.gpa;
        }
        if (transcriptEle.subject?.name?.endsWith('12') && transcriptEle?.semester == '1') {
          transcriptItem.transcript[4].scores.push(score);
          transcriptItem.transcript[4].sum += score.gpa;
        }
        if (transcriptEle.subject?.name?.endsWith('12') && transcriptEle?.semester == '2') {
          transcriptItem.transcript[5].scores.push(score);
          transcriptItem.transcript[5].sum += score.gpa;
        }
      });
      return transcriptItem;
    });
    res.status(200).json({ data: transcriptMapped });
  } catch (error) {
    next(error);
  }
};

export const handleUpdateTranscript = async (req: Request, res: Response, next: NextFunction) => {
  const transcriptId = parseInt(req.params.transcriptId);
  const data = req.body;

  try {
    const transcript = await TranscriptModel.update(transcriptId, data);
    res.status(200).json({ data: transcript });
  } catch (error) {
    next(error);
  }
};

export const handleDeleteTranscript = async (req: Request, res: Response, next: NextFunction) => {
  const transcriptId = parseInt(req.params.transcriptId);
  try {
    const transcript = await TranscriptModel.delete(transcriptId);
    res.status(200).json({ data: transcript });
  } catch (error) {
    next(error);
  }
};

export const handleCreateTranscript = async (req: Request, res: Response, next: NextFunction) => {
  const data = req.body;
  try {
    const transcript = await TranscriptModel.create(data);
    res.status(200).json({ data: transcript });
  } catch (error) {
    next(error);
  }
};
