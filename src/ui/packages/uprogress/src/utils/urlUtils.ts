import { UI_URLS } from '../constants';

export const localRedirect = (localUrl: string): void => {
  // eslint-disable-next-line no-restricted-globals
  location.assign(localUrl);
};

export const redirectToLogin = (): void => {
  localRedirect(UI_URLS.auth.login);
};
