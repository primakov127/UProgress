import { BaseResult } from './BaseResult';
export type CreateTask = {
  disciplineId: string;
  name: string;
  description: string;
  isRequired: boolean;
};

export type CreateTaskResult = BaseResult & {
  id: string;
};
