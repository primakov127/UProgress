import { AnswerStatus } from '@ui/app-shell';
import { TaskAnswerHistoryItem } from '../TaskAnswerHistoryItem';
import { BaseResult } from './BaseResult';

export type GetTaskAnswer = {
  taskAnswerId: string;
};

export type GetTaskAnswerResult = BaseResult & {
  id: string;
  mark?: number;
  status: AnswerStatus;
  taskId: string;
  studentId: string;
  approvedById: string;
  history: Array<TaskAnswerHistoryItem>;
};
