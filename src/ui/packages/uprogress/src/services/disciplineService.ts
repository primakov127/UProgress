import { API_URLS } from '../constants';
import {
  DeleteDiscipline,
  DeleteDisciplineResult,
} from '../models/messages/DeleteDiscipline';
import { GetDisciplineListResult } from '../models/messages/GetDisciplineList';
import { getHttpClient } from '../utils/httpUtils';
import {
  CreateDiscipline,
  CreateDisciplineResult,
} from './../models/messages/CreateDiscipline';

const createDiscipline = async (
  message: CreateDiscipline
): Promise<CreateDisciplineResult> => {
  try {
    const result = (
      await getHttpClient().post(API_URLS.discipline.createDiscipline, message)
    ).data;

    return {
      isSuccessful: true,
      id: result.disciplineId,
    };
  } catch (e: unknown) {
    return {
      isSuccessful: false,
    } as CreateDisciplineResult;
  }
};

const getDisciplineList = async (): Promise<GetDisciplineListResult> => {
  try {
    const result = (
      await getHttpClient().get(API_URLS.discipline.getDisciplineList)
    ).data;

    return {
      isSuccessful: true,
      list: result,
    };
  } catch (e: unknown) {
    return {
      isSuccessful: false,
    } as GetDisciplineListResult;
  }
};

const deleteDiscipline = async (
  message: DeleteDiscipline
): Promise<DeleteDisciplineResult> => {
  try {
    await getHttpClient().post(API_URLS.discipline.deleteDiscipline, message);

    return {
      isSuccessful: true,
    };
  } catch (e: unknown) {
    return {
      isSuccessful: false,
    } as DeleteDisciplineResult;
  }
};

export const disciplineService = {
  createDiscipline,
  getDisciplineList,
  deleteDiscipline,
};
