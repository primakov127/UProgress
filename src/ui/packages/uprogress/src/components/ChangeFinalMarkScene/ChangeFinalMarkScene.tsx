import { SubGroupType, useEffectAsync, useLoading } from '@ui/app-shell';
import { Button, Form, InputNumber, notification, Spin } from 'antd';
import { useState } from 'react';
import { useParams } from 'react-router-dom';
import styled from 'styled-components';
import { GetGroupDisciplineResult } from '../../models/messages/GetGroupDiscipline';
import { assignService } from '../../services/assignService';
import { getType } from '../../utils/stringUtils';

export const ChangeFinalMarkScene = () => {
  const { groupId, disciplineId, subGroupType } = useParams<{
    groupId: string;
    disciplineId: string;
    subGroupType: string;
  }>();
  const [isLoading, setIsLoading] = useState(false);
  const [groupDiscipline, setGroupDiscipline] =
    useState<GetGroupDisciplineResult>();
  const [form] = Form.useForm();
  const { loading, loadingHandler } = useLoading();

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

  const handleChange = loadingHandler(async () => {
    const studentMarks = await form.validateFields();
    const result = await assignService.changeFinalMarks({
      disciplineId: disciplineId,
      students: groupDiscipline?.students.map((s) => ({
        studentId: s.studentId,
        mark: studentMarks[s.studentId],
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
      })) as any,
    });

    if (result.isSuccessful) {
      notification.success({ message: 'Отметки изменены' });
      const result = await assignService.getGroupDiscipline({
        groupId: groupId,
        disciplineId: disciplineId,
        subGroupType: subGroupType as unknown as SubGroupType,
      });
      if (result.isSuccessful) {
        setGroupDiscipline(result);
      }
    }
  });

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

  return isLoading ? (
    <Spin spinning size="large" />
  ) : groupDiscipline ? (
    <Container>
      <h1>
        Дисциплина: <i>{groupDiscipline.disciplineName}</i>
      </h1>
      <h1>
        Тип: <i>{getType(groupDiscipline.disciplineType)}</i>
      </h1>
      <h1>
        Группа: <i>{groupDiscipline.groupName}</i>
      </h1>
      {Number(subGroupType) !== SubGroupType.Full && (
        <h1>
          Подгруппа: <i>{getSubGroupType(Number(subGroupType))}</i>
        </h1>
      )}
      <Form
        form={form}
        labelCol={{ span: 4 }}
        initialValues={Object.fromEntries(
          groupDiscipline.students.map((s) => [s.studentId, s.finalMark])
        )}
      >
        {groupDiscipline.students.map((s) => (
          <Form.Item name={s.studentId} label={s.fullName}>
            <InputNumber disabled={loading} />
          </Form.Item>
        ))}

        <Button type="primary" onClick={handleChange} loading={loading}>
          Изменить
        </Button>
      </Form>
    </Container>
  ) : null;
};

const Container = styled.div``;
