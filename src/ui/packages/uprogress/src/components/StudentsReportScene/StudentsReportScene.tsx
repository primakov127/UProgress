/* eslint-disable @typescript-eslint/no-explicit-any */
import { Button, Form, InputNumber, List, Select, Spin } from 'antd';
import styled from 'styled-components';
import { useState } from 'react';
import { DisciplineListItem } from '../../models/DisciplineListItem';
import { useEffectAsync, useLoading } from '@ui/app-shell';
import { disciplineService } from '../../services/disciplineService';
import { SelectStudentsResult } from '../../models/messages/SelectStudents';
import { assignService } from '../../services/assignService';
import { Link } from 'react-router-dom';
import { UI_URLS } from '../../constants';

export const StudentsReportScene = () => {
  const [students, setStudents] = useState<SelectStudentsResult>();
  const [disciplines, setDisciplines] = useState<DisciplineListItem[]>();
  const [isLoading, setIsLoading] = useState(false);
  const [form] = Form.useForm();
  const { loading, loadingHandler } = useLoading();

  useEffectAsync(async () => {
    setIsLoading(true);

    const result = await disciplineService.getDisciplineList();
    if (result.isSuccessful) {
      setDisciplines(result.list);
    }

    setIsLoading(false);
  }, []);

  const handleShow = loadingHandler(async () => {
    const { disciplineId, operator, mark } = await form.validateFields();
    const result = await assignService.selectSudents({
      disciplineId: disciplineId,
      operator: operator,
      mark: mark,
    });
    if (result.isSuccessful) {
      setStudents(result);
    }
  });

  return isLoading ? (
    <Spin spinning size="large" />
  ) : disciplines ? (
    <Container>
      <Form form={form} layout="inline">
        <Form.Item
          name="disciplineId"
          label="Дисциплина"
          rules={[{ required: true, message: 'Выберите группу' }]}
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
          label="Оператор"
          name="operator"
          rules={[{ required: true, message: 'Оператор' }]}
        >
          <Select placeholder="Больше">
            <Select.Option key="РАВНО" value="РАВНО">
              Равно
            </Select.Option>
            <Select.Option key="БОЛЬШЕ" value="БОЛЬШЕ">
              Больше
            </Select.Option>
            <Select.Option key="МЕНЬШЕ" value="МЕНЬШЕ">
              Меньше
            </Select.Option>
          </Select>
        </Form.Item>

        <Form.Item
          label="Отметка"
          name="mark"
          rules={[
            {
              required: true,
              message: 'Отметка',
              min: 0,
              type: 'number',
            },
          ]}
        >
          <InputNumber />
        </Form.Item>

        <Button type="primary" onClick={handleShow} loading={loading}>
          Показать
        </Button>
      </Form>
      {students && (
        <List
          size="large"
          itemLayout="horizontal"
          dataSource={students.students}
          renderItem={(s) => (
            <List.Item>
              <List.Item.Meta
                title={
                  <Link to={UI_URLS.group.view.url(s.studentId)}>
                    {s.studentName}
                  </Link>
                }
                description={
                  <p>
                    <span>Группа: </span>
                    <Link to={UI_URLS.group.view.url(s.groupId)}>
                      {s.groupName}
                    </Link>
                  </p>
                }
              />
            </List.Item>
          )}
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
