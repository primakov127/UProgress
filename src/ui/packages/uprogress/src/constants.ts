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
    getUserList: 'user/getuserlist',
    createUser: 'user/create',
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
    add: '/user/add',
    view: '/user/view',
  },
};
