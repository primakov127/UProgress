import { MyDisciplinesItem } from '../MyDisciplinesItem';
import { BaseResult } from './BaseResult';

export type GetMyDisciplinesResult = BaseResult & {
  list: Array<MyDisciplinesItem>;
};
