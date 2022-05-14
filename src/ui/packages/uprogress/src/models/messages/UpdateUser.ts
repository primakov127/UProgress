import { UserRole } from '@ui/app-shell';
import { BaseResult } from './BaseResult';

export type UpdateUser = {
  id: string;
  fullName: string;
  username: string;
  email: string;
  phone?: string;
  password?: string;
  userRoles: UserRole[];
};

export type UpdateUserResult = BaseResult;
