import { DisciplineType, SubGroupType } from '@ui/app-shell';

export type MyGroupDisciplinesItem = {
  id: string;
  teacherId: string;
  subGroupType: SubGroupType;
  groupId: string;
  groupName: string;
  disciplineId: string;
  disciplineName: string;
  disciplineSemester: number;
  disciplineType: DisciplineType;
};
