import { BaseResult } from './BaseResult';

export type UpdateTask = {
  id: string;
  name: string;
  description: string;
  isRequired: boolean;
};

export type UpdateTaskResult = BaseResult;
