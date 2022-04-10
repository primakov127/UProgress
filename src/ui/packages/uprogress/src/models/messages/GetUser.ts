import { User } from '@ui/app-shell';
import { BaseResult } from './BaseResult';

export type GetUser = {
  userId: string;
};

export type GetUserResult = BaseResult & User;
