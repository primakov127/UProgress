import { Speciality } from '@ui/app-shell';
import { BaseResult } from './BaseResult';

export type GetSpecialityListResult = BaseResult & {
  list: Array<Speciality>;
};
