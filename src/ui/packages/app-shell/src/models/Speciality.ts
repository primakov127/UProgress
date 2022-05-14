import { Discipline } from './Discipline';

export type Speciality = {
  id: string;
  shortName: string;
  name: string;
  semesterCount: number;

  disciplines: Array<Discipline>;
};
