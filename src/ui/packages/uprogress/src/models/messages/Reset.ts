import { BaseResult } from './BaseResult';

export type Reset = {
  email: string;
  resetToken: string;
  newPassword: string;
};

export type ResetResult = BaseResult;
