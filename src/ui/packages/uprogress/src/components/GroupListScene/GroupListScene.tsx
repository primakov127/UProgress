import { useEffectAsync, useRole } from '@ui/app-shell';
import { Button, Empty, Input, List, Modal, notification } from 'antd';
import { EditOutlined, DeleteOutlined, PlusOutlined } from '@ant-design/icons';
import { useState } from 'react';
import { Link } from 'react-router-dom';
import styled from 'styled-components';
import { UI_URLS } from '../../constants';
import { GroupListItem } from '../../models/GroupListItem';
import { groupService } from '../../services/groupService';

export const GroupListScene = () => {
  const [groups, setGroups] = useState<GroupListItem[]>();
  const { isAdmin } = useRole();
  const [search, setSearch] = useState('');

  useEffectAsync(async () => {
    const result = await groupService.getGroupList();
    if (result.isSuccessful) {
      setGroups(result.list);
    }
  }, []);

  const showDeleteConfirm = (id: string, name: string) => {
    Modal.confirm({
      title: `Вы хотите удалить группу: ${name} ?`,
      onOk: async () => {
        const result = await groupService.deleteGroup({ groupId: id });
        if (result.isSuccessful) {
          notification.success({ message: 'Группа успешно удалена' });

          const groups = await groupService.getGroupList();
          setGroups(groups.list);
          return;
        }

        notification.error({ message: 'Не удалось удалить группу' });
      },
    });
  };

  return (
    <div>
      {groups ? (
        <Container>
          <div className="conrtols-container">
            <Input
              placeholder="Название"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
            {isAdmin && (
              <Link to={UI_URLS.group.add}>
                <Button type="dashed" icon={<PlusOutlined />}>
                  Добавить группу
                </Button>
              </Link>
            )}
          </div>
          <List
            size="large"
            itemLayout="horizontal"
            dataSource={groups.filter(
              (g) =>
                !search || g.name.toLowerCase().includes(search.toLowerCase())
            )}
            renderItem={(g) => (
              <List.Item
                actions={[
                  isAdmin && (
                    <Link to={UI_URLS.group.view.url(g.id)}>
                      <EditOutlined />
                    </Link>
                  ),
                  isAdmin && (
                    <Button
                      type="text"
                      icon={<DeleteOutlined />}
                      onClick={() => showDeleteConfirm(g.id, g.name)}
                    />
                  ),
                ]}
              >
                <List.Item.Meta
                  title={
                    <Link to={UI_URLS.group.view.url(g.id)}>{g.name}</Link>
                  }
                  description={
                    <p>
                      <span>Староста: </span>
                      <Link to={UI_URLS.user.view.url(g.headId)}>
                        {g.headName}
                      </Link>
                    </p>
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
