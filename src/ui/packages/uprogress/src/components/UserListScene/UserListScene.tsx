import { useEffectAsync } from '@ui/app-shell';
import {
  EditOutlined,
  DeleteOutlined,
  UserAddOutlined,
} from '@ant-design/icons';
import { Button, Empty, List } from 'antd';
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
                  <Link to={'/user/delete'}>
                    <EditOutlined />
                  </Link>,
                  <Link to={'/user/edit'}>
                    <DeleteOutlined />
                  </Link>,
                ]}
              >
                <List.Item.Meta
                  avatar={<UserTypeIcon userType={u.userType} />}
                  title={<Link to={`/user/${u.id}`}>{u.fullName}</Link>}
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
