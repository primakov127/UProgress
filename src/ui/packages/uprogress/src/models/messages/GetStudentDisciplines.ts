import { MyDisciplinesItem } from '../MyDisciplinesItem';
import { BaseResult } from './BaseResult';

export type GetStudentDisciplines = {
  studentId: string;
};

export type GetStudentDisciplinesResult = BaseResult & {
  list: Array<MyDisciplinesItem>;
};
