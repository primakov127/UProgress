import { COOKIES, UI_URLS } from '../constants';
import { deleteCookie } from './cookieUtils';

export const localRedirect = (localUrl: string): void => {
  // eslint-disable-next-line no-restricted-globals
  location.assign(localUrl);
};

export const redirectToLogin = (): void => {
  deleteCookie(COOKIES.authCookie);
  localRedirect(UI_URLS.auth.login);
};
