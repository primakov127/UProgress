import { userState } from '@ui/app-shell';
import { useRecoilValue } from 'recoil';

export const UserListScene = () => {
  const user = useRecoilValue(userState);

  return (
    <ul>
      <li>Id: {user?.id}</li>
      <li>Username: {user?.username}</li>
      <li>Email: {user?.email}</li>
      <li>Phone: {user?.phone}</li>
      <li>FullName: {user?.fullName}</li>
      <li>UserType: {user?.userType}</li>
      <li>GroupId: {user?.groupId}</li>
      <li>SubGroupType: {user?.subGroupType}</li>
    </ul>
  );
};
