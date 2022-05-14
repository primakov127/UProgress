import { DisciplineType } from './../../../../app-shell/src/models/DisciplineType';
import { BaseResult } from './BaseResult';

export type CreateDiscipline = {
  name: string;
  description: string;
  semester: number;
  type: DisciplineType;
  specialityId: string;
};

export type CreateDisciplineResult = BaseResult & {
  id: string;
};
