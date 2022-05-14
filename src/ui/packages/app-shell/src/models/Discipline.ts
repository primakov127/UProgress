import { DisciplineType } from './DisciplineType';
import { Speciality } from './Speciality';
import { Task } from './Task';

export type Discipline = {
  id: string;
  name: string;
  description: string;
  semester: number;
  type: DisciplineType;
  specialityId: string;

  speciality?: Speciality;
  tasks?: Array<Task>;
};
