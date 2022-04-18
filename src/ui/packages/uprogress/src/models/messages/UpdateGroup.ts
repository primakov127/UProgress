import { BaseResult } from './BaseResult';

export type UpdateGroup = {
  groupId: string;
  startYear: number;
  graduatedYear: number;
  number: number;
  headId: string;
};

export type UpdateGroupResult = BaseResult;
