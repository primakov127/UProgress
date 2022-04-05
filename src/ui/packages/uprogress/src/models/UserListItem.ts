import { UserType } from '@ui/app-shell';

export type UserListItem = {
  id: string;
  fullName: string;
  userType: UserType;
};
