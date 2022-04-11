import { DisciplineListItem } from '../DisciplineListItem';
import { BaseResult } from './BaseResult';

export type GetDisciplineListResult = BaseResult & {
  list: Array<DisciplineListItem>;
};
