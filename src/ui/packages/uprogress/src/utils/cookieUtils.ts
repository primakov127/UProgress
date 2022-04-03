import { COOKIES } from '../constants';

export const getCookie = (name: string) => {
  const nameLenPlus = name.length + 1;

  return (
    document.cookie
      .split(';')
      .map((c) => c.trim())
      .filter((cookie) => cookie.substring(0, nameLenPlus) === `${name}=`)
      .map((cookie) => decodeURIComponent(cookie.substring(nameLenPlus)))[0] ||
    null
  );
};

export const deleteCookie = (name: string) => {
  document.cookie = name + '=; Path=/; Expires=Thu, 01 Jan 1970 00:00:01 GMT;';
};

export const getAuthTokenFromCookie = () => {
  const authToken = getCookie(COOKIES.authCookie);
  console.log(authToken);
  if (!authToken) {
    // TODO: redirect to login URL
  }

  return authToken as string;
};
