import { BaseResult } from './BaseResult';

export type AssignDisciplineToGroup = {
  disciplineId: string;
  groupId: string;
  firstSubGroupTeacherId: string;
  secondSubGroupTeacherId: string;
};

export type AssignDisciplineToGroupResult = BaseResult;
