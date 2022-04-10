import {
  CreateGroup,
  CreateGroupResult,
} from './../models/messages/CreateGroup';
import { API_URLS } from '../constants';
import { GetGroupListResult } from '../models/messages/GetGroupList';
import { getHttpClient } from '../utils/httpUtils';
import { DeleteGroup, DeleteGroupResult } from '../models/messages/DeleteGroup';
import { GetSpecialityListResult } from '../models/messages/GetSpecialityList';

const getGroupList = async (): Promise<GetGroupListResult> => {
  try {
    const result = (await getHttpClient().get(API_URLS.group.getGroupList))
      .data;

    return {
      isSuccessful: true,
      list: result,
    };
  } catch (e: unknown) {
    return {
      isSuccessful: false,
    } as GetGroupListResult;
  }
};

const createGroup = async (
  message: CreateGroup
): Promise<CreateGroupResult> => {
  try {
    const result = (
      await getHttpClient().post(API_URLS.group.createGroup, message)
    ).data;

    return {
      isSuccessful: true,
      id: result.userId,
    };
  } catch (e: unknown) {
    return {
      isSuccessful: false,
    } as CreateGroupResult;
  }
};

const deleteGroup = async (
  message: DeleteGroup
): Promise<DeleteGroupResult> => {
  try {
    await getHttpClient().post(API_URLS.group.deleteGroup, message);

    return {
      isSuccessful: true,
    };
  } catch (e: unknown) {
    return {
      isSuccessful: false,
    } as DeleteGroupResult;
  }
};

const getSpecialityList = async (): Promise<GetSpecialityListResult> => {
  try {
    const result = (await getHttpClient().get(API_URLS.group.getSpecialityList))
      .data;

    return {
      isSuccessful: true,
      list: result,
    };
  } catch (e: unknown) {
    return {
      isSuccessful: false,
    } as GetSpecialityListResult;
  }
};

export const groupService = {
  getGroupList,
  createGroup,
  deleteGroup,
  getSpecialityList,
};
