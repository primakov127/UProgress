import { User } from '@ui/app-shell';
import { message } from 'antd';
import { API_URLS } from '../constants';
import {
  ActivateUser,
  ActivateUserResult,
} from '../models/messages/ActivateUser';
import { CreateUser, CreateUserResult } from '../models/messages/CreateUser';
import {
  DeactivateUser,
  DeactivateUserResult,
} from '../models/messages/DeactivateUser';
import { GetCurrentUserResult } from '../models/messages/GetCurrentUser';
import { GetUser, GetUserResult } from '../models/messages/GetUser';
import { GetUserListResult } from '../models/messages/GetUserList';
import { getHttpClient } from '../utils/httpUtils';

const getCurrentUser = async (): Promise<GetCurrentUserResult> => {
  try {
    const result = (await getHttpClient().get(API_URLS.user.getCurrentUser))
      .data as User;

    return {
      isSuccessful: true,
      id: result.id,
      username: result.username,
      email: result.email,
      phone: result.phone,
      fullName: result.fullName,
      userType: result.userType,
      userRoles: result.userRoles,
      groupId: result.groupId,
      subGroupType: result.subGroupType,
    };
  } catch (e: unknown) {
    return {
      isSuccessful: false,
    } as GetCurrentUserResult;
  }
};

const getUserList = async (): Promise<GetUserListResult> => {
  try {
    const result = (await getHttpClient().get(API_URLS.user.getUserList)).data;

    return {
      isSuccessful: true,
      list: result,
    };
  } catch (e: unknown) {
    return {
      isSuccessful: false,
    } as GetUserListResult;
  }
};

const createUser = async (message: CreateUser): Promise<CreateUserResult> => {
  try {
    const result = (
      await getHttpClient().post(API_URLS.user.createUser, message)
    ).data;

    return {
      isSuccessful: true,
      id: result.userId,
    };
  } catch (e: unknown) {
    return {
      isSuccessful: false,
    } as CreateUserResult;
  }
};

const deactivateUser = async (
  message: DeactivateUser
): Promise<DeactivateUserResult> => {
  try {
    await getHttpClient().post(API_URLS.user.deactivateUser, message);

    return {
      isSuccessful: true,
    };
  } catch (e: unknown) {
    return {
      isSuccessful: false,
    } as DeactivateUserResult;
  }
};

const activateUser = async (
  message: ActivateUser
): Promise<ActivateUserResult> => {
  try {
    await getHttpClient().post(API_URLS.user.activateUser, message);

    return {
      isSuccessful: true,
    };
  } catch (e: unknown) {
    return {
      isSuccessful: false,
    } as DeactivateUserResult;
  }
};

const getUser = async (message: GetUser): Promise<GetUserResult> => {
  try {
    const result = (await getHttpClient().post(API_URLS.user.getUser, message))
      .data as User;

    return {
      isSuccessful: true,
      id: result.id,
      username: result.username,
      email: result.email,
      phone: result.phone,
      fullName: result.fullName,
      userType: result.userType,
      userRoles: result.userRoles,
      groupId: result.groupId,
      subGroupType: result.subGroupType,
    };
  } catch (e: unknown) {
    return {
      isSuccessful: false,
    } as GetCurrentUserResult;
  }
};

export const userService = {
  getCurrentUser,
  getUserList,
  createUser,
  deactivateUser,
  activateUser,
  getUser,
};
