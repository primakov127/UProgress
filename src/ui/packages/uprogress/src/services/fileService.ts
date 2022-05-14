import { API_URLS } from '../constants';
import { getHttpClient } from '../utils/httpUtils';
import { BaseResult } from './../models/messages/BaseResult';

const remove = async (id: string): Promise<BaseResult> => {
  try {
    await getHttpClient().post(`${API_URLS.file.remove}/${id}`);

    return {
      isSuccessful: true,
    };
  } catch (e: unknown) {
    return {
      isSuccessful: false,
    } as BaseResult;
  }
};

export const fileService = {
  remove,
};
