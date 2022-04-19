/* eslint-disable @typescript-eslint/no-explicit-any */
import { useEffectAsync, useRole } from '@ui/app-shell';
import {
  Button,
  Drawer,
  Empty,
  Input,
  List,
  Modal,
  notification,
  Tag,
} from 'antd';
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
  const { isAdmin } = useRole();
  const [search, setSearch] = useState('');

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
          <div className="conrtols-container">
            <Input
              placeholder="Название"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
            {isAdmin && (
              <Link to={UI_URLS.discipline.add}>
                <Button type="dashed" icon={<PlusOutlined />}>
                  Добавить дисциплину
                </Button>
              </Link>
            )}
            {isAdmin && (
              <Button
                style={{ marginLeft: '10px' }}
                onClick={() => setIsAssignToStudentVisible(true)}
              >
                Назначить студенту
              </Button>
            )}
            {isAdmin && (
              <Button
                style={{ marginLeft: '10px' }}
                onClick={() => setIsAssignToGroupVisible(true)}
              >
                Назначить группе
              </Button>
            )}
          </div>
          <List
            size="large"
            itemLayout="horizontal"
            dataSource={disciplines.filter(
              (d) =>
                !search || d.name.toLowerCase().includes(search.toLowerCase())
            )}
            renderItem={(d) => (
              <List.Item
                actions={[
                  isAdmin && (
                    <Link to={UI_URLS.discipline.view.url(d.id)}>
                      <EditOutlined />
                    </Link>
                  ),
                  isAdmin && (
                    <Button
                      type="text"
                      icon={<DeleteOutlined />}
                      onClick={() => showDeleteConfirm(d.id, d.name)}
                    />
                  ),
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
