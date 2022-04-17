import { AnswerStatus, DisciplineType, SubGroupType } from '@ui/app-shell';
import { BaseResult } from './BaseResult';

export type GetGroupDiscipline = {
  groupId: string;
  disciplineId: string;
  subGroupType: SubGroupType;
};

export type GetGroupDisciplineResult = BaseResult & {
  groupId: string;
  groupName: string;
  disciplineId: string;
  disciplineName: string;
  disciplineType: DisciplineType;
  tasks: Array<GetGroupDisciplineTask>;
  students: Array<GetGroupDisciplineStudent>;
};

type GetGroupDisciplineTask = {
  taskId: string;
  name: string;
  isRequired: boolean;
};

type GetGroupDisciplineStudent = {
  studentId: string;
  fullName: string;
  finalMark?: number;
  taskAnswers: Array<GetGroupDisciplineTaskAnswer>;
};

type GetGroupDisciplineTaskAnswer = {
  taskId: string;
  taskAnswerId: string;
  mark?: number;
  status: AnswerStatus;
};
