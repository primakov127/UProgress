import axios from 'axios';
import { API_URLS } from '../constants';
import { Login, LoginResult } from '../models/messages/Login';
import { RequestReset } from '../models/messages/RequestReset';
import { Reset, ResetResult } from '../models/messages/Reset';
import { getHttpClient } from '../utils/httpUtils';

const login = async (message: Login): Promise<LoginResult> => {
  try {
    await getHttpClient().post(API_URLS.auth.login, message, {
      withCredentials: true,
    });

    return {
      isSuccessful: true,
    };
  } catch (e: unknown) {
    if (axios.isAxiosError(e)) {
      return {
        isSuccessful: false,
        error: e.response?.data.error,
      };
    } else {
      return {
        isSuccessful: false,
      };
    }
  }
};

const requestReset = async (message: RequestReset): Promise<LoginResult> => {
  try {
    await getHttpClient().post(API_URLS.auth.requestReset, message);

    return {
      isSuccessful: true,
    };
  } catch (e: unknown) {
    if (axios.isAxiosError(e)) {
      return {
        isSuccessful: false,
        error: e.response?.data.error,
      };
    } else {
      return {
        isSuccessful: false,
      };
    }
  }
};

const reset = async (message: Reset): Promise<ResetResult> => {
  try {
    await getHttpClient().post(API_URLS.auth.reset, message);

    return {
      isSuccessful: true,
    };
  } catch (e: unknown) {
    if (axios.isAxiosError(e)) {
      return {
        isSuccessful: false,
        error: e.response?.data.error,
      };
    } else {
      return {
        isSuccessful: false,
      };
    }
  }
};

export const authService = {
  login,
  requestReset,
  reset,
};
