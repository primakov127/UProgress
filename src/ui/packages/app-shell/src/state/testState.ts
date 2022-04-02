import { atom } from 'recoil';
import { Test } from '../models/Test';

const keyPrefix = 'testState/';

const KEYS = {
  test: `${keyPrefix}test`,
};

export const testState = atom<Test | undefined>({
  key: KEYS.test,
  default: undefined,
});
