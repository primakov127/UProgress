import { BaseResult } from './BaseResult';

export type RequestApprove = {
  taskAnswerId: string;
  message?: string;
  answer: string;
};

export type RequestApproveResult = BaseResult;
