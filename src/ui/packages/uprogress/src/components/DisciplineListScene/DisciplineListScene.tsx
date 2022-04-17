/* eslint-disable @typescript-eslint/no-explicit-any */
import { DisciplineType, useEffectAsync } from '@ui/app-shell';
import { Button, Drawer, Empty, List, Modal, notification, Tag } from 'antd';
import { EditOutlined, DeleteOutlined, PlusOutlined } from '@ant-design/icons';
import { useState } from 'react';
import { Link } from 'react-router-dom';
import styled from 'styled-components';
import { UI_URLS } from '../../constants';
import { DisciplineListItem } from '../../models/DisciplineListItem';
import { StudentListItem } from '../../models/StudentListItem';
import { disciplineService } from '../../services/disciplineService';
import { userService } from '../../services/userService';
import { AssignToStudent } from '../AssignToStudent/AssignToStudent';
import { AssignToGroup } from '../AssignToGroup/AssignToGroup';
import { GroupListItem } from '../../models/GroupListItem';
import { groupService } from '../../services/groupService';
import { getType } from '../../utils/stringUtils';

export const DisciplineListScene = () => {
  const [disciplines, setDisciplines] = useState<DisciplineListItem[]>();
  const [isAssignToStudentVisible, setIsAssignToStudentVisible] =
    useState(false);
  const [isAssignToGroupVisible, setIsAssignToGroupVisible] = useState(false);
  const [students, setStudents] = useState<StudentListItem[]>([]);
  const [groups, setGroups] = useState<GroupListItem[]>([]);
  const [teachers, setTeachers] = useState<StudentListItem[]>([]);

  useEffectAsync(async () => {
    const result = await disciplineService.getDisciplineList();
    if (result.isSuccessful) {
      setDisciplines(result.list);
    }

    const resultList = await userService.getStudentList();
    if (resultList.isSuccessful) {
      setStudents(resultList.list);
    }

    const resultGroup = await groupService.getGroupList();
    if (resultGroup.isSuccessful) {
      setGroups(resultGroup.list);
    }

    const resultTeachers = await userService.getTeacherList();
    if (resultTeachers.isSuccessful) {
      setTeachers(resultTeachers.list);
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

  return (
    <div>
      {disciplines ? (
        <Container>
          <Drawer
            title="Назанчить дисциплину студенту"
            visible={isAssignToStudentVisible}
            onClose={() => setIsAssignToStudentVisible(false)}
          >
            <AssignToStudent
              disciplines={disciplines}
              students={students}
              cb={() => setIsAssignToStudentVisible(false)}
            />
          </Drawer>
          <Drawer
            title="Назанчить дисциплину группе"
            visible={isAssignToGroupVisible}
            onClose={() => setIsAssignToGroupVisible(false)}
          >
            <AssignToGroup
              disciplines={disciplines}
              groups={groups}
              teachers={teachers}
              cb={() => setIsAssignToGroupVisible(false)}
            />
          </Drawer>
          <Link to={UI_URLS.discipline.add}>
            <Button type="dashed" icon={<PlusOutlined />}>
              Добавить дисциплину
            </Button>
          </Link>
          <Button onClick={() => setIsAssignToStudentVisible(true)}>
            Назначить студенту
          </Button>
          <Button onClick={() => setIsAssignToGroupVisible(true)}>
            Назначить группе
          </Button>
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
