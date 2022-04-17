import {
  GetGroupDiscipline,
  GetGroupDisciplineResult,
} from './../models/messages/GetGroupDiscipline';
import { GetMyGroupDisciplinesResult } from './../models/messages/GetMyGroupDisciplines';
import { API_URLS } from '../constants';
import {
  AssignDisciplineToGroup,
  AssignDisciplineToGroupResult,
} from '../models/messages/AssignDisciplineToGroup';
import {
  AssignDisciplineToStudent,
  AssignDisciplineToStudentResult,
} from '../models/messages/AssignDisciplineToStudent';
import { getHttpClient } from '../utils/httpUtils';

const assignDisciplineToStudent = async (
  message: AssignDisciplineToStudent
): Promise<AssignDisciplineToStudentResult> => {
  try {
    await getHttpClient().post(
      API_URLS.assign.assignDisciplineToStudent,
      message
    );

    return {
      isSuccessful: true,
    };
  } catch (e: unknown) {
    return {
      isSuccessful: false,
    } as AssignDisciplineToStudentResult;
  }
};

const assignDisciplineToGroup = async (
  message: AssignDisciplineToGroup
): Promise<AssignDisciplineToGroupResult> => {
  try {
    await getHttpClient().post(
      API_URLS.assign.assignDisciplineToGroup,
      message
    );

    return {
      isSuccessful: true,
    };
  } catch (e: unknown) {
    return {
      isSuccessful: false,
    } as AssignDisciplineToGroupResult;
  }
};

const getMyGroupDisciplines =
  async (): Promise<GetMyGroupDisciplinesResult> => {
    try {
      const result = (
        await getHttpClient().get(API_URLS.assign.myGroupDisciplines)
      ).data;

      return {
        isSuccessful: true,
        list: result,
      };
    } catch (e: unknown) {
      return {
        isSuccessful: false,
      } as GetMyGroupDisciplinesResult;
    }
  };

const getGroupDiscipline = async (
  message: GetGroupDiscipline
): Promise<GetGroupDisciplineResult> => {
  try {
    const result = (
      await getHttpClient().post(API_URLS.assign.getGroupDiscipline, message)
    ).data;

    return {
      isSuccessful: true,
      ...result,
    };
  } catch (e: unknown) {
    return {
      isSuccessful: false,
    } as GetGroupDisciplineResult;
  }
};

export const assignService = {
  assignDisciplineToStudent,
  assignDisciplineToGroup,
  getMyGroupDisciplines,
  getGroupDiscipline,
};
