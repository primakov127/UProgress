import { User } from '@ui/app-shell';
import { API_URLS } from '../constants';
import { GetCurrentUserResult } from '../models/messages/GetCurrentUser';
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

export const userService = {
  getCurrentUser,
};
