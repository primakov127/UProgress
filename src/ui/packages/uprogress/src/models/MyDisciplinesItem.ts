import { DisciplineType } from '@ui/app-shell';

export type MyDisciplinesItem = {
  id: string;
  name: string;
  semester: number;
  type: DisciplineType;
  specialityShortName: string;
  finalMark?: number;
  progress: number;
};
