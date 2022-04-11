import { useEffectAsync } from '@ui/app-shell';
import { Button, Empty, List, Modal, notification } from 'antd';
import { EditOutlined, DeleteOutlined, PlusOutlined } from '@ant-design/icons';
import { useState } from 'react';
import { Link } from 'react-router-dom';
import styled from 'styled-components';
import { UI_URLS } from '../../constants';
import { GroupListItem } from '../../models/GroupListItem';
import { groupService } from '../../services/groupService';

export const GroupListScene = () => {
  const [groups, setGroups] = useState<GroupListItem[]>();

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
          <Link to={UI_URLS.group.add}>
            <Button type="dashed" icon={<PlusOutlined />}>
              Добавить группу
            </Button>
          </Link>
          <List
            size="large"
            itemLayout="horizontal"
            dataSource={groups}
            renderItem={(g) => (
              <List.Item
                actions={[
                  <Link to={`${UI_URLS.group.view}/${g.id}`}>
                    <EditOutlined />
                  </Link>,
                  <Button
                    type="text"
                    icon={<DeleteOutlined />}
                    onClick={() => showDeleteConfirm(g.id, g.name)}
                  />,
                ]}
              >
                <List.Item.Meta
                  title={
                    <Link to={`${UI_URLS.group.view}/${g.id}`}>{g.name}</Link>
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

const Container = styled.div``;
