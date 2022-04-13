import { BaseResult } from './BaseResult';

export type Reject = {
  taskAnswerId: string;
  message?: string;
};

export type RejectResult = BaseResult;
