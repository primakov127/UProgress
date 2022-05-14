import { Discipline } from '@ui/app-shell';
import { BaseResult } from './BaseResult';

export type GetDiscipline = {
  disciplineId: string;
};

export type GetDisciplineResult = BaseResult & Discipline;
