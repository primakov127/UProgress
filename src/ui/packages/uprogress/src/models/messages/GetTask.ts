import { Task } from './../../../../app-shell/src/models/Task';
import { BaseResult } from './BaseResult';

export type GetTask = {
  taskId: string;
};

export type GetTaskResult = BaseResult & Task;
