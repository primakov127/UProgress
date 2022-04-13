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

export const assignService = {
  assignDisciplineToStudent,
  assignDisciplineToGroup,
};
