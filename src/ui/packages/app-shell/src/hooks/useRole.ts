import { userState } from './../state/userState';
import { useRecoilValue } from 'recoil';

export const useRole = () => {
  const user = useRecoilValue(userState);

  return user?.userRoles;
};
