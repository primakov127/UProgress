import { GetGroup, GetGroupResult } from './../models/messages/GetGroup';
import {
  CreateGroup,
  CreateGroupResult,
} from './../models/messages/CreateGroup';
import { API_URLS } from '../constants';
import { GetGroupListResult } from '../models/messages/GetGroupList';
import { getHttpClient } from '../utils/httpUtils';
import { DeleteGroup, DeleteGroupResult } from '../models/messages/DeleteGroup';
import { GetSpecialityListResult } from '../models/messages/GetSpecialityList';
import { UpdateGroup, UpdateGroupResult } from '../models/messages/UpdateGroup';
import { BaseResult } from '../models/messages/BaseResult';
import { SubGroupType } from '@ui/app-shell';

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

const getGroup = async (message: GetGroup): Promise<GetGroupResult> => {
  try {
    const result = (
      await getHttpClient().post(API_URLS.group.getGroup, message)
    ).data;

    return {
      isSuccessful: true,
      ...result,
    };
  } catch (e: unknown) {
    return {
      isSuccessful: false,
    } as GetGroupResult;
  }
};

const updateGroup = async (
  message: UpdateGroup
): Promise<UpdateGroupResult> => {
  try {
    await getHttpClient().post(API_URLS.group.updateGroup, message);

    return {
      isSuccessful: true,
    };
  } catch (e: unknown) {
    return {
      isSuccessful: false,
    } as UpdateGroupResult;
  }
};

const addGroupStudent = async (message: {
  groupId: string;
  studentId: string;
  subGroupType: SubGroupType;
}): Promise<BaseResult> => {
  try {
    await getHttpClient().post(API_URLS.group.addGroupStudent, message);

    return {
      isSuccessful: true,
    };
  } catch (e: unknown) {
    return {
      isSuccessful: false,
    } as UpdateGroupResult;
  }
};

const removeGroupStudent = async (message: {
  groupId: string;
  studentId: string;
}): Promise<BaseResult> => {
  try {
    await getHttpClient().post(API_URLS.group.removeGroupStudent, message);

    return {
      isSuccessful: true,
    };
  } catch (e: unknown) {
    return {
      isSuccessful: false,
    } as UpdateGroupResult;
  }
};

export const groupService = {
  getGroupList,
  createGroup,
  deleteGroup,
  getSpecialityList,
  getGroup,
  updateGroup,
  addGroupStudent,
  removeGroupStudent,
};
