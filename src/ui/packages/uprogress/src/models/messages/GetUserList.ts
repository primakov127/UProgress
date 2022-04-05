import { UserListItem } from '../UserListItem';
import { BaseResult } from './BaseResult';

export type GetUserListResult = BaseResult & {
  list: Array<UserListItem>;
};
