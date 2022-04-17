import { BaseResult } from './BaseResult';
export type GetGroupSessionAccess = {
  groupId: string;
  semester: number;
};

export type GetGroupSessionAccessResult = BaseResult & {
  students: Array<GetGroupSessionAccessStudent>;
};

type GetGroupSessionAccessStudent = {
  studentId: string;
  fullName: string;
  access: boolean;
};
