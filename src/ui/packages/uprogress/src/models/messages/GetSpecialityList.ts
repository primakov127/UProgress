import { Speciality } from '../Speciality';
import { BaseResult } from './BaseResult';
export type GetSpecialityListResult = BaseResult & {
  list: Array<Speciality>;
};
