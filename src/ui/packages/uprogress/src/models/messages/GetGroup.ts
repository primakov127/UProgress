import { SubGroupType } from '@ui/app-shell';
import { BaseResult } from './BaseResult';

export type GetGroup = {
  groupId: string;
};

export type GetGroupResult = BaseResult & {
  id: string;
  startYear: number;
  graduatedYear: number;
  number: number;
  headId: string;
  headName: string;
  specialityId: string;
  specialityShortName: string;
  students: Array<GetGroupStudent>;
};

type GetGroupStudent = {
  studentId: string;
  studentName: string;
  subGroupType: SubGroupType;
};
