import { User } from '@ui/app-shell';
import { API_URLS } from '../constants';
import { CreateUser, CreateUserResult } from '../models/messages/CreateUser';
import { GetCurrentUserResult } from '../models/messages/GetCurrentUser';
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

export const userService = {
  getCurrentUser,
  getUserList,
  createUser,
};
