import { SubGroupType } from './SubGroupType';
import { UserRole } from './UserRole';
import { UserType } from './UserType';

export type User = {
  id: string;
  username: string;
  email: string;
  phone: string;
  fullName: string;
  userType: UserType;
  userRoles: UserRole[];
  groupId?: string;
  subGroupType?: SubGroupType;
};
