import axios, { AxiosInstance } from 'axios';
import { config } from '../config';
import { getAuthTokenFromCookie } from './cookieUtils';
import { redirectToLogin } from './urlUtils';

export const getHttpClient = () => {
  const httpClient = axios.create({
    baseURL: config.apiUrl,
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${getAuthTokenFromCookie()}`,
    },
  });

  [handleUnauthenticatedRequests].forEach((interceptor) =>
    interceptor(httpClient)
  );

  return httpClient;
};

const handleUnauthenticatedRequests = (client: AxiosInstance) => {
  client.interceptors.response.use(
    (response) => response,
    (error) => {
      if (error.response.status === 401) {
        redirectToLogin();
      }

      return Promise.reject(error);
    }
  );
};
