import { useEffectAsync, UserType } from '@ui/app-shell';
import {
  EditOutlined,
  UserDeleteOutlined,
  UserAddOutlined,
  SearchOutlined,
  ClearOutlined,
} from '@ant-design/icons';
import {
  Button,
  Empty,
  Input,
  List,
  notification,
  Select,
  Tooltip,
} from 'antd';
import { useState } from 'react';
import { Link } from 'react-router-dom';
import { UserListItem } from '../../models/UserListItem';
import { userService } from '../../services/userService';
import { UserTypeIcon } from '../UserTypeIcon/UserTypeIcon';
import styled from 'styled-components';
import { UI_URLS } from '../../constants';

export const UserListScene = () => {
  const [users, setUsers] = useState<UserListItem[]>();
  const [filter, setFilter] = useState<{
    search?: string;
    userTypes?: UserType[];
  }>();

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

    notification.error({ message: 'Не удалось активировать пользователя' });
  };

  const filterUser = (
    user: UserListItem,
    userTypes?: UserType[],
    search?: string
  ): boolean => {
    let result = true;

    if (search && userTypes) {
      return (
        user.fullName.toLowerCase().includes(search.toLowerCase()) &&
        // eslint-disable-next-line eqeqeq
        userTypes.find((ut) => ut == user.userType) !== undefined
      );
    }

    if (search) {
      result = user.fullName.toLowerCase().includes(search.toLowerCase());
    }

    if (userTypes && userTypes.length > 0) {
      // eslint-disable-next-line eqeqeq
      result = userTypes.find((ut) => ut == user.userType) !== undefined;
    }

    return result;
  };

  const clearFilter = () => {
    setFilter(undefined);
  };

  return (
    <div>
      {users ? (
        <Container>
          <div className="conrtols-container">
            <Input
              placeholder="ФИО"
              value={filter?.search}
              onChange={(e) =>
                setFilter((prev) => ({ ...prev, search: e.target.value }))
              }
            />
            <Select
              mode="multiple"
              placeholder="Выберите тип..."
              onChange={(e) => setFilter((prev) => ({ ...prev, userTypes: e }))}
              value={filter?.userTypes}
            >
              <Select.Option key={UserType.Dean}>Декан</Select.Option>
              <Select.Option key={UserType.Teacher}>
                Преподаватель
              </Select.Option>
              <Select.Option key={UserType.Student}>Студент</Select.Option>
            </Select>
            <Button
              onClick={clearFilter}
              type="dashed"
              icon={<ClearOutlined />}
            >
              Сброс
            </Button>
            <Link to={UI_URLS.user.add}>
              <Button type="dashed" icon={<UserAddOutlined />}>
                Добавить пользователя
              </Button>
            </Link>
          </div>
          <List
            pagination={{ pageSize: 10 }}
            size="large"
            itemLayout="horizontal"
            dataSource={users.filter((u) =>
              filterUser(u, filter?.userTypes, filter?.search)
            )}
            renderItem={(u) => (
              <List.Item
                actions={[
                  <Link to={UI_URLS.user.view.url(u.id)}>
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
                    <Link to={UI_URLS.user.view.url(u.id)}>{u.fullName}</Link>
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

const Container = styled.div`
  .conrtols-container {
    display: flex;
    padding-bottom: 20px;

    .ant-select {
      width: 300px;
      margin-left: 10px;
    }

    input {
      width: 200px;
    }

    button {
      margin-left: 10px;
    }

    a {
      margin-left: auto;
    }
  }
`;
