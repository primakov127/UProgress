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
    deactivateUser: 'user/deactivate',
    activateUser: 'user/activate',
    getUser: 'user/getuser',
    getStudentList: 'user/getstudentlist',
  },
  group: {
    createGroup: 'group/create',
    getGroupList: 'group/getgrouplist',
    deleteGroup: 'group/delete',
    getSpecialityList: 'group/getspecialitylist',
  },
  discipline: {
    createDiscipline: 'discipline/create',
    getDisciplineList: 'discipline/getdisciplinelist',
    deleteDiscipline: 'discipline/delete',
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
  group: {
    list: '/group/list',
    add: '/group/add',
    view: '/group/view',
  },
  discipline: {
    list: '/discipline/list',
    add: '/discipline/add',
    view: '/discipline/view',
  },
};
