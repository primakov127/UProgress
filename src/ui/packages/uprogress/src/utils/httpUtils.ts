import axios from 'axios';
import { config } from '../config';
import { getAuthTokenFromCookie } from './cookieUtils';

export const getHttpClient = () =>
  axios.create({
    baseURL: config.apiUrl,
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${getAuthTokenFromCookie()}`,
    },
  });
