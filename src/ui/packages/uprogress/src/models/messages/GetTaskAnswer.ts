import { AnswerStatus } from '@ui/app-shell';
import { AnswerAttachment } from '../Attachment';
import { TaskAnswerHistoryItem } from '../TaskAnswerHistoryItem';
import { BaseResult } from './BaseResult';

export type GetTaskAnswer = {
  taskAnswerId: string;
};

export type GetTaskAnswerResult = BaseResult & {
  id: string;
  mark?: number;
  answer: string;
  status: AnswerStatus;
  taskId: string;
  taskName: string;
  studentId: string;
  approvedById: string;
  disciplineId: string;
  disciplineName: string;
  history: Array<TaskAnswerHistoryItem>;
  attachments: Array<AnswerAttachment>;
};
