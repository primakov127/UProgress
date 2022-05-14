/* eslint-disable @typescript-eslint/no-explicit-any */
import {
  AnswerStatus,
  DisciplineType,
  SubGroupType,
  useEffectAsync,
} from '@ui/app-shell';
import { Button, Spin, Table, Tag } from 'antd';
import { useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import styled from 'styled-components';
import { UI_URLS } from '../../constants';
import { GetGroupDisciplineResult } from '../../models/messages/GetGroupDiscipline';
import { assignService } from '../../services/assignService';

export const GroupDisciplineScene = () => {
  const { groupId, disciplineId, subGroupType } = useParams<{
    groupId: string;
    disciplineId: string;
    subGroupType: string;
  }>();
  const [isLoading, setIsLoading] = useState(false);
  const [groupDiscipline, setGroupDiscipline] =
    useState<GetGroupDisciplineResult>();

  useEffectAsync(async () => {
    setIsLoading(true);
    const result = await assignService.getGroupDiscipline({
      groupId: groupId,
      disciplineId: disciplineId,
      subGroupType: subGroupType as unknown as SubGroupType,
    });
    if (result.isSuccessful) {
      setGroupDiscipline(result);
    }

    setIsLoading(false);
  }, [groupId, disciplineId, subGroupType]);

  const getSubGroupType = (type: SubGroupType) => {
    switch (type) {
      case SubGroupType.First:
        return '1-ая подгруппа';
      case SubGroupType.Second:
        return '2-ая подгруппа';
      case SubGroupType.Full:
        return 'вся группа';
      default:
        return '';
    }
  };

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

  const getFinalMarkCell = (disciplineType?: DisciplineType, mark = 0) => {
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

  const tableData = groupDiscipline?.students.map((s) => ({
    key: s.studentId,
    name: s.fullName,
    ...Object.fromEntries(s.taskAnswers.map((ta) => [ta.taskId, ta])),
    finalMark: s.finalMark,
  }));

  const tableColumns = [
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
          title: gd.name + (gd.isRequired ? ' (Обязательно)' : ''),
          dataIndex: gd.taskId,
          key: gd.taskId,
          render: (object: any) =>
            object && (
              <Link to={UI_URLS.taskAnswer.view.url(object?.taskAnswerId)}>
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
        getFinalMarkCell(groupDiscipline?.disciplineType, text),
    },
  ];

  return isLoading ? (
    <Spin spinning size="large" />
  ) : groupDiscipline ? (
    <Container>
      <h1>
        Дисциплина: <i>{groupDiscipline.disciplineName}</i>
      </h1>
      <h1>
        Группа: <i>{groupDiscipline.groupName}</i>
      </h1>
      {Number(subGroupType) !== SubGroupType.Full && (
        <h1>
          Подгруппа: <i>{getSubGroupType(Number(subGroupType))}</i>
        </h1>
      )}
      {groupDiscipline && (
        <Link
          to={UI_URLS.teacher.changeFinalMark.url(
            groupDiscipline.groupId,
            groupDiscipline.disciplineId,
            SubGroupType.Full
          )}
        >
          <Button style={{ marginBottom: '20px' }}>Изменить итог</Button>
        </Link>
      )}
      <Table columns={tableColumns} dataSource={tableData} bordered />
    </Container>
  ) : null;
};

const Container = styled.div``;
