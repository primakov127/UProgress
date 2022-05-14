import { BaseResult } from './BaseResult';

export type CreateTaskAnswer = {
  answer: string;
  studentId: string;
  taskId: string;
};

export type CreateTaskAnswerResult = BaseResult & {
  taskAnswerId: string;
};
