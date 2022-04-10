import { GroupListItem } from './../GroupListItem';
import { BaseResult } from './BaseResult';

export type GetGroupListResult = BaseResult & {
  list: Array<GroupListItem>;
};
