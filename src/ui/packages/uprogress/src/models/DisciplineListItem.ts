import { DisciplineType } from '@ui/app-shell';

export type DisciplineListItem = {
  id: string;
  name: string;
  semester: number;
  type: DisciplineType;
  specialityShortName: string;
};
