import { UserRole, UserType } from '@ui/app-shell';
import { BaseResult } from './BaseResult';

export type CreateUser = {
  fullName: string;
  username: string;
  email: string;
  phone: string;
  password: string;
  userType: UserType;
  userRoles: UserRole[];
};

export type CreateUserResult = BaseResult & {
  id: string;
};
