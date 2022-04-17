/* eslint-disable @typescript-eslint/no-explicit-any */
import {
  AnswerStatus,
  DisciplineType,
  SubGroupType,
  useEffectAsync,
  useLoading,
} from '@ui/app-shell';
import { Button, Form, Select, Spin, Table, Tag } from 'antd';
import { useState } from 'react';
import { Link } from 'react-router-dom';
import styled from 'styled-components';
import { UI_URLS } from '../../constants';
import { DisciplineListItem } from '../../models/DisciplineListItem';
import { GroupListItem } from '../../models/GroupListItem';
import { GetGroupDisciplineResult } from '../../models/messages/GetGroupDiscipline';
import { assignService } from '../../services/assignService';
import { disciplineService } from '../../services/disciplineService';
import { groupService } from '../../services/groupService';

export const GroupDisciplineReportScene = () => {
  const [groups, setGroups] = useState<GroupListItem[]>();
  const [disciplines, setDisciplines] = useState<DisciplineListItem[]>();
  const [groupDiscipline, setGroupDiscipline] =
    useState<GetGroupDisciplineResult>();
  const [isLoading, setIsLoading] = useState(false);
  const [form] = Form.useForm();
  const { loading, loadingHandler } = useLoading();

  useEffectAsync(async () => {
    setIsLoading(true);

    const groupsResult = await groupService.getGroupList();
    if (groupsResult.isSuccessful) {
      setGroups(groupsResult.list);
    }

    const disciplinesResult = await disciplineService.getDisciplineList();
    if (disciplinesResult.isSuccessful) {
      setDisciplines(disciplinesResult.list);
    }

    setIsLoading(false);
  }, []);

  const handleShow = loadingHandler(async () => {
    const { disciplineId, groupId } = await form.validateFields();
    const result = await assignService.getGroupDiscipline({
      groupId: groupId,
      disciplineId: disciplineId,
      subGroupType: SubGroupType.Full,
    });

    if (result.isSuccessful) {
      setGroupDiscipline(result);
    }
  });

  const getAnswerCell = (status: AnswerStatus, mark?: number) => {
    if (mark) {
      return <Tag color="green">{mark}</Tag>;
    }

    switch (status) {
      case AnswerStatus.Draft:
        return <Tag color="purple">Черновик</Tag>;
      case AnswerStatus.Approvable:
        return <Tag color="geekblue">На проверке</Tag>;
      case AnswerStatus.Approved:
        return <Tag color="green">Проверен</Tag>;
      case AnswerStatus.Rejected:
        return <Tag color="volcano">Отклонен</Tag>;
      default:
        return <Tag>Новый</Tag>;
    }
  };

  const getFinalMarkCell = (disciplineType: DisciplineType, mark = 0) => {
    switch (disciplineType) {
      case DisciplineType.Exam:
        return <Tag color="geekblue">{mark}</Tag>;
      case DisciplineType.Free:
        return <Tag color="geekblue">Free</Tag>;
      case DisciplineType.Mark:
        return <Tag color="geekblue">{mark}</Tag>;
      case DisciplineType.NoMark:
        return <Tag color="geekblue">{mark > 0 ? 'Зачет' : 'Не зачет'}</Tag>;
      case DisciplineType.Project:
        return <Tag color="geekblue">{mark}</Tag>;
      default:
        return <Tag>:)</Tag>;
    }
  };

  return isLoading ? (
    <Spin spinning size="large" />
  ) : groups && disciplines ? (
    <Container>
      <Form form={form} layout="inline">
        <Form.Item
          name="disciplineId"
          label="Дисциплина"
          rules={[{ required: true, message: 'Выберите дисциплину' }]}
        >
          <Select
            disabled={loading}
            showSearch
            placeholder="Выберите дисциплину"
            optionFilterProp="children"
            filterOption={(input, option) =>
              (option as any).children
                .toLowerCase()
                .indexOf(input.toLowerCase()) >= 0
            }
            filterSort={(optionA, optionB) =>
              (optionA as any).children
                .toLowerCase()
                .localeCompare((optionB as any).children.toLowerCase())
            }
          >
            {disciplines.map((d) => (
              <Select.Option key={d.id}>{d.name}</Select.Option>
            ))}
          </Select>
        </Form.Item>

        <Form.Item
          name="groupId"
          label="Группа"
          rules={[{ required: true, message: 'Выберите группу' }]}
        >
          <Select
            disabled={loading}
            showSearch
            placeholder="Выберите группу"
            optionFilterProp="children"
            filterOption={(input, option) =>
              (option as any).children
                .toLowerCase()
                .indexOf(input.toLowerCase()) >= 0
            }
            filterSort={(optionA, optionB) =>
              (optionA as any).children
                .toLowerCase()
                .localeCompare((optionB as any).children.toLowerCase())
            }
          >
            {groups.map((s) => (
              <Select.Option key={s.id}>{s.name}</Select.Option>
            ))}
          </Select>
        </Form.Item>

        <Button type="primary" onClick={handleShow} loading={loading}>
          Показать
        </Button>
        {groupDiscipline && (
          <Link
            to={UI_URLS.teacher.changeFinalMark.url(
              groupDiscipline.groupId,
              groupDiscipline.disciplineId,
              SubGroupType.Full
            )}
          >
            <Button style={{ marginLeft: '10px' }}>Изменить итог</Button>
          </Link>
        )}
      </Form>
      {groupDiscipline && (
        <Table
          columns={[
            {
              title: 'ФИО',
              dataIndex: 'name',
              key: 'name',
              render: (text: any, record: any) => (
                <Link to={UI_URLS.user.view.url(record.key)}>{text}</Link>
              ),
            },
            ...(groupDiscipline
              ? groupDiscipline.tasks.map((gd) => ({
                  title: gd.name,
                  dataIndex: gd.taskId,
                  key: gd.taskId,
                  render: (object: any) =>
                    object && (
                      <Link
                        to={UI_URLS.taskAnswer.view.url(object?.taskAnswerId)}
                      >
                        {getAnswerCell(object?.status, object?.mark)}
                      </Link>
                    ),
                }))
              : []),
            {
              title: 'Итог',
              dataIndex: 'finalMark',
              key: 'finalMark',
              render: (text: any, record: any) =>
                getFinalMarkCell(groupDiscipline.disciplineType, text),
            },
          ]}
          dataSource={groupDiscipline?.students.map((s) => ({
            key: s.studentId,
            name: s.fullName,
            ...Object.fromEntries(s.taskAnswers.map((ta) => [ta.taskId, ta])),
            finalMark: s.finalMark,
          }))}
          bordered
        />
      )}
    </Container>
  ) : null;
};

const Container = styled.div`
  form {
    padding-bottom: 30px;
  }
`;
