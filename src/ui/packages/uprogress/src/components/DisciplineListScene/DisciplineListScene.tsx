import { DisciplineType, useEffectAsync } from '@ui/app-shell';
import { Button, Empty, List, Modal, notification, Tag } from 'antd';
import { EditOutlined, DeleteOutlined, PlusOutlined } from '@ant-design/icons';
import { useState } from 'react';
import { Link } from 'react-router-dom';
import styled from 'styled-components';
import { UI_URLS } from '../../constants';
import { DisciplineListItem } from '../../models/DisciplineListItem';
import { disciplineService } from '../../services/disciplineService';

export const DisciplineListScene = () => {
  const [disciplines, setDisciplines] = useState<DisciplineListItem[]>();

  useEffectAsync(async () => {
    const result = await disciplineService.getDisciplineList();
    if (result.isSuccessful) {
      setDisciplines(result.list);
    }
  }, []);

  const showDeleteConfirm = (id: string, name: string) => {
    Modal.confirm({
      title: `Вы хотите удалить дисциплину: ${name} ?`,
      onOk: async () => {
        const result = await disciplineService.deleteDiscipline({
          disciplineId: id,
        });
        if (result.isSuccessful) {
          notification.success({ message: 'Дисциплина успешно удалена' });

          const disciplines = await disciplineService.getDisciplineList();
          setDisciplines(disciplines.list);
          return;
        }

        notification.error({ message: 'Не удалось удалить дисциплину' });
      },
    });
  };

  const getType = (key: DisciplineType) => {
    switch (key) {
      case DisciplineType.Exam:
        return 'Экзамен';
      case DisciplineType.Free:
        return 'Без итоговой отметки';
      case DisciplineType.Mark:
        return 'Дифференцированный зачет';
      case DisciplineType.NoMark:
        return 'Зачет';
      case DisciplineType.Project:
        return 'Курсовой проект';
      default:
        return '';
    }
  };

  return (
    <div>
      {disciplines ? (
        <Container>
          <Link to={UI_URLS.discipline.add}>
            <Button type="dashed" icon={<PlusOutlined />}>
              Добавить дисциплину
            </Button>
          </Link>
          <List
            size="large"
            itemLayout="horizontal"
            dataSource={disciplines}
            renderItem={(d) => (
              <List.Item
                actions={[
                  <Link to={UI_URLS.discipline.view.url(d.id)}>
                    <EditOutlined />
                  </Link>,
                  <Button
                    type="text"
                    icon={<DeleteOutlined />}
                    onClick={() => showDeleteConfirm(d.id, d.name)}
                  />,
                ]}
              >
                <List.Item.Meta
                  title={
                    <Link to={UI_URLS.discipline.view.url(d.id)}>{d.name}</Link>
                  }
                  description={
                    <>
                      <Tag color="magenta">{`${d.semester} семестр`}</Tag>
                      <Tag color="gold">{getType(d.type)}</Tag>
                      <Tag color="geekblue">{d.specialityShortName}</Tag>
                    </>
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
