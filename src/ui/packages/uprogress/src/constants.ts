import { SubGroupType } from '@ui/app-shell';

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
    updateUser: 'user/update',
    deactivateUser: 'user/deactivate',
    activateUser: 'user/activate',
    getUser: 'user/getuser',
    getStudentWithoutGroupList: 'user/getstudentwithoutgrouplist',
    getStudentList: 'user/getstudentlist',
    getTeacherList: 'user/getteacherlist',
  },
  group: {
    createGroup: 'group/create',
    getGroupList: 'group/getgrouplist',
    deleteGroup: 'group/delete',
    getSpecialityList: 'group/getspecialitylist',
    getGroup: 'group/getgroup',
    updateGroup: 'group/updategroup',
    removeGroupStudent: 'group/removegroupstudent',
    addGroupStudent: 'group/addgroupstudent',
  },
  discipline: {
    createDiscipline: 'discipline/create',
    getDisciplineList: 'discipline/getdisciplinelist',
    deleteDiscipline: 'discipline/delete',
    createTask: 'discipline/createtask',
    deleteTask: 'discipline/deletetask',
    getDiscipline: 'discipline/getdiscipline',
    getTask: 'discipline/gettask',
    myDisciplines: 'discipline/mydisciplines',
  },
  assign: {
    assignDisciplineToStudent: 'assign/assigndisciplinetostudent',
    assignDisciplineToGroup: 'assign/assigndisciplinetogroup',
    myGroupDisciplines: 'assign/mygroupdisciplines',
    getGroupDiscipline: 'assign/getgroupdiscipline',
    getGroupSessionAccess: 'assign/getgroupsessionaccess',
    changeFinalMarks: 'assign/changefinalmarks',
    selectStudents: 'assign/selectstudents',
  },
  taskAnswer: {
    createTaskAnswer: 'taskanswer/createtaskanswer',
    getTaskAnswer: 'taskanswer/gettaskanswer',
    requestApprove: 'taskanswer/requestapprove',
    approve: 'taskanswer/approve',
    reject: 'taskanswer/reject',
  },
};

export const UI_URLS = {
  home: '/',
  profile: '/myprofile',
  myProgress: '/myprogress',
  auth: {
    login: '/auth/login',
    forgotPassword: '/auth/forgotpassword',
    resetPassword: '/auth/resetpassword',
  },
  user: {
    list: '/user/list',
    add: '/user/add',
    view: {
      template: '/user/view/:userId',
      url: (userId: string) => `/user/view/${userId}`,
    },
  },
  group: {
    list: '/group/list',
    add: '/group/add',
    view: {
      template: '/group/view/:groupId',
      url: (groupId: string) => `/group/view/${groupId}`,
    },
  },
  discipline: {
    mylist: '/discipline/my',
    list: '/discipline/list',
    add: '/discipline/add',
    view: {
      template: '/discipline/view/:disciplineId',
      url: (disciplineId: string) => `/discipline/view/${disciplineId}`,
    },
    addTask: {
      template: '/discipline/addtask/:disciplineId',
      url: (disciplineId: string) => `/discipline/addtask/${disciplineId}`,
    },
    viewTask: {
      template: '/discipline/:disciplineId/viewtask/:taskId',
      url: (disciplineId: string, taskId: string) =>
        `/discipline/${disciplineId}/viewtask/${taskId}`,
    },
  },
  taskAnswer: {
    add: {
      template: '/taskanswer/add/:taskId',
      url: (taskId: string) => `/taskanswer/add/${taskId}`,
    },
    view: {
      template: '/taskanswer/view/:taskAnswerId',
      url: (taskAnswerId: string) => `/taskanswer/view/${taskAnswerId}`,
    },
  },
  teacher: {
    my: '/teacher/mygroupsdisciplines',
    group: {
      template:
        '/teacher/group/:groupId/discipline/:disciplineId/subgroup/:subGroupType',
      url: (
        groupId: string,
        disciplineId: string,
        subGroupType: SubGroupType
      ) =>
        `/teacher/group/${groupId}/discipline/${disciplineId}/subgroup/${subGroupType}`,
    },
    changeFinalMark: {
      template:
        '/teacher/changemark/group/:groupId/discipline/:disciplineId/subgroup/:subGroupType',
      url: (
        groupId: string,
        disciplineId: string,
        subGroupType: SubGroupType
      ) =>
        `/teacher/changemark/group/${groupId}/discipline/${disciplineId}/subgroup/${subGroupType}`,
    },
  },
  report: {
    groupDiscipline: '/report/groupdiscipline',
    sessionAccess: '/report/sessionaccess',
    students: '/report/students',
  },
};
