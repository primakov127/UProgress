import { atom } from 'recoil';
import { User } from '../models/User';

const keyPrefix = 'userState/';

const KEYS = {
  user: `${keyPrefix}user`,
};

export const userState = atom<User | undefined>({
  key: KEYS.user,
  default: undefined,
});
