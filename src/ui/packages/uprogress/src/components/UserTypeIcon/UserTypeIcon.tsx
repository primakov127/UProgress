import { UserType } from '@ui/app-shell';
import { Avatar, Tooltip } from 'antd';

type Props = {
  userType: UserType;
  noTooltip?: boolean;
};

export const UserTypeIcon = ({ userType, noTooltip }: Props) => {
  switch (userType) {
    case UserType.Dean:
      return noTooltip ? (
        <Avatar
          style={{
            backgroundColor: '#1890ff',
          }}
        >
          Д
        </Avatar>
      ) : (
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
      return noTooltip ? (
        <Avatar
          style={{
            backgroundColor: '#1890ff',
          }}
        >
          П
        </Avatar>
      ) : (
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
      return noTooltip ? (
        <Avatar
          style={{
            backgroundColor: '#1890ff',
          }}
        >
          С
        </Avatar>
      ) : (
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
