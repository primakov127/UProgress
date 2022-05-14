import { Discipline } from './Discipline';

export type Task = {
  id: string;
  name: string;
  description: string;
  isRequired: boolean;
  disciplineId: string;

  discipline?: Discipline;
};
