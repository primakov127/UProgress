import { useRole, userState, UserType } from '@ui/app-shell';
import { Descriptions } from 'antd';
import { Link } from 'react-router-dom';
import { useRecoilValue } from 'recoil';
import { UI_URLS } from '../../constants';

export const Profile = () => {
  const user = useRecoilValue(userState);
  const { isStudent } = useRole();

  const getUserType = (userType?: UserType) => {
    switch (userType) {
      case UserType.Dean:
        return 'Декан';
      case UserType.Teacher:
        return 'Преподаватель';
      case UserType.Student:
        return 'Студент';
      default:
        return 'Да';
    }
  };

  return (
    <Descriptions title="Профиль">
      <Descriptions.Item label="ФИО">{user?.fullName}</Descriptions.Item>
      <Descriptions.Item label="Username">{user?.username}</Descriptions.Item>
      <Descriptions.Item label="Email">{user?.email}</Descriptions.Item>
      <Descriptions.Item label="Телефон">{user?.phone}</Descriptions.Item>
      <Descriptions.Item label="Тип аккаунта">
        {getUserType(user?.userType)}
      </Descriptions.Item>
      {isStudent && user?.groupId && (
        <Descriptions.Item label="Моя группа">
          <Link to={UI_URLS.group.view.url(user?.groupId)}>ссылка</Link>
        </Descriptions.Item>
      )}
    </Descriptions>
  );
};
