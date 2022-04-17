import { userState } from './../state/userState';
import { useRecoilValue } from 'recoil';
import { UserRole } from '../models/UserRole';

export const useRole = () => {
  const user = useRecoilValue(userState);

  return {
    isStudent: user?.userRoles.includes(UserRole.Student),
    isGroupHead: user?.userRoles.includes(UserRole.GroupHead),
    isTeacher: user?.userRoles.includes(UserRole.Teacher),
    isAdmin: user?.userRoles.includes(UserRole.Admin),
  };
};

export const useUserType = () => {
  const user = useRecoilValue(userState);

  return user?.userType;
};
