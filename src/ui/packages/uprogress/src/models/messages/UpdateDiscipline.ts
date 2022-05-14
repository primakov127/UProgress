import { DisciplineType } from './../../../../app-shell/src/models/DisciplineType';
import { BaseResult } from './BaseResult';

export type UpdateDiscipline = {
  id: string;
  name: string;
  description: string;
  semester: number;
  type: DisciplineType;
  specialityId: string;
};

export type UpdateDisciplineResult = BaseResult;
