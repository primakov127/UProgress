import { AnswerStatus } from '@ui/app-shell';

export type TaskAnswerHistoryItem = {
  date: string;
  statusMovedTo: AnswerStatus;
  message?: string;
  userId: string;
  answerId: string;
  user: {
    userId: string;
    fullName: string;
  };
};
