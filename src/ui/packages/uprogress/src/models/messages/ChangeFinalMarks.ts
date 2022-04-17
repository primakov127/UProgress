import { BaseResult } from './BaseResult';
export type ChangeFinalMarks = {
  disciplineId: string;
  students: Array<ChangeFinalMarksStudent>;
};

type ChangeFinalMarksStudent = {
  studentId: string;
  mark?: number;
};

export type ChangeFinalMarksResult = BaseResult;
