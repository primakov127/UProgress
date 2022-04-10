import { StudentListItem } from './../StudentListItem';
import { BaseResult } from './BaseResult';

export type GetStudentListResult = BaseResult & {
  list: Array<StudentListItem>;
};
