import { BaseResult } from './BaseResult';

export type Login = {
  usernameOrEmail: string;
  password: string;
};

export type LoginResult = BaseResult;
