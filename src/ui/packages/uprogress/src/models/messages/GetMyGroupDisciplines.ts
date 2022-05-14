import { MyGroupDisciplinesItem } from '../MyGroupDisciplinesItem';
import { BaseResult } from './BaseResult';

export type GetMyGroupDisciplinesResult = BaseResult & {
  list: Array<MyGroupDisciplinesItem>;
};
