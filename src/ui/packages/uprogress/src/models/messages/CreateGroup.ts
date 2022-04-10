import { BaseResult } from './BaseResult';
import { SubGroupType } from '@ui/app-shell';

export type CreateGroup = {
  startYear: number;
  graduatedYear: number;
  number: number;
  headId: string;
  specialityId: string;
  students: Array<{
    studentId: string;
    subGroupType: SubGroupType;
  }>;
};

export type CreateGroupResult = BaseResult & {
  id: string;
};
