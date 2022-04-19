import { BaseResult } from './BaseResult';

export type SelectStudents = {
  disciplineId: string;
  operator: string;
  mark: number;
};

export type SelectStudentsResult = BaseResult & {
  students: Array<SelectStudentsResultStudent>;
};

type SelectStudentsResultStudent = {
  studentId: string;
  studentName: string;
  groupId: string;
  groupName: string;
};
