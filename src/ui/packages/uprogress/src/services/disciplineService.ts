import { API_URLS } from '../constants';
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

export const disciplineService = {
  createDiscipline,
};
