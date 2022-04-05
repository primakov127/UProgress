export const COOKIES = {
  authCookie: 'uprogress-st',
};

export const API_URLS = {
  test: {
    getWeather: 'WeatherForecast',
  },
  auth: {
    login: 'auth/login',
    requestReset: 'auth/requestreset',
    reset: 'auth/reset',
    confirm: 'auth/confirm',
  },
  user: {
    getCurrentUser: 'user/getcurrentuser',
  },
};

export const UI_URLS = {
  home: '/',
  auth: {
    login: '/auth/login',
    forgotPassword: '/auth/forgotpassword',
    resetPassword: '/auth/resetpassword',
  },
  user: {
    list: '/user/list',
  },
};
