import { useEffectAsync } from '@ui/app-shell';
import {
  EditOutlined,
  UserDeleteOutlined,
  UserAddOutlined,
} from '@ant-design/icons';
import { Button, Empty, List, notification, Tooltip } from 'antd';
import { useState } from 'react';
import { Link } from 'react-router-dom';
import { UserListItem } from '../../models/UserListItem';
import { userService } from '../../services/userService';
import { UserTypeIcon } from '../UserTypeIcon/UserTypeIcon';
import styled from 'styled-components';
import { UI_URLS } from '../../constants';

export const UserListScene = () => {
  const [users, setUsers] = useState<UserListItem[]>();

  useEffectAsync(async () => {
    const result = await userService.getUserList();
    if (result.isSuccessful) {
      setUsers(result.list);
    }
  }, []);

  const handleDeactivate = async (id: string) => {
    const result = await userService.deactivateUser({ userId: id });
    if (result.isSuccessful) {
      notification.success({ message: 'Пользователь деактивирован' });

      const getUsersResult = await userService.getUserList();
      setUsers(getUsersResult.list);
      return;
    }

    notification.error({ message: 'Неудалось деактивировать пользователя' });
  };

  const handleActivate = async (id: string) => {
    const result = await userService.activateUser({ userId: id });
    if (result.isSuccessful) {
      notification.success({ message: 'Пользователь активирован' });

      const getUsersResult = await userService.getUserList();
      setUsers(getUsersResult.list);
      return;
    }

    notification.error({ message: 'Неудалось активировать пользователя' });
  };

  return (
    <div>
      {users ? (
        <Container>
          <Link to={UI_URLS.user.add}>
            <Button type="dashed" icon={<UserAddOutlined />}>
              Добавить пользователя
            </Button>
          </Link>
          <List
            size="large"
            itemLayout="horizontal"
            dataSource={users}
            renderItem={(u) => (
              <List.Item
                actions={[
                  <Link to={`${UI_URLS.user.view}/${u.id}`}>
                    <EditOutlined />
                  </Link>,
                  <Tooltip
                    title={u.isActive ? 'Деактивировать' : 'Активировать'}
                  >
                    <Button
                      type="text"
                      icon={
                        u.isActive ? (
                          <UserDeleteOutlined />
                        ) : (
                          <UserAddOutlined />
                        )
                      }
                      onClick={() =>
                        u.isActive
                          ? handleDeactivate(u.id)
                          : handleActivate(u.id)
                      }
                    />
                  </Tooltip>,
                ]}
              >
                <List.Item.Meta
                  avatar={<UserTypeIcon userType={u.userType} />}
                  title={
                    <Link to={`${UI_URLS.user.view}/${u.id}`}>
                      {u.fullName}
                    </Link>
                  }
                />
              </List.Item>
            )}
          />
        </Container>
      ) : (
        <Empty description="Пусто" />
      )}
    </div>
  );
};

const Container = styled.div``;
