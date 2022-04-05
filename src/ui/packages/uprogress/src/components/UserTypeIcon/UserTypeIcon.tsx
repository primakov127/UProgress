import { UserType } from '@ui/app-shell';
import { Avatar, Tooltip } from 'antd';

type Props = {
  userType: UserType;
};

export const UserTypeIcon = ({ userType }: Props) => {
  switch (userType) {
    case UserType.Dean:
      return (
        <Tooltip title="Декан" placement="top">
          <Avatar
            style={{
              backgroundColor: '#1890ff',
            }}
          >
            Д
          </Avatar>
        </Tooltip>
      );
    case UserType.Teacher:
      return (
        <Tooltip title="Преподаватель" placement="top">
          <Avatar
            style={{
              backgroundColor: '#1890ff',
            }}
          >
            П
          </Avatar>
        </Tooltip>
      );
    case UserType.Student:
    default:
      return (
        <Tooltip title="Студент" placement="top">
          <Avatar
            style={{
              backgroundColor: '#1890ff',
            }}
          >
            С
          </Avatar>
        </Tooltip>
      );
  }
};
