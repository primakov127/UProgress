/* eslint-disable @typescript-eslint/no-explicit-any */
import { useEffectAsync, useLoading } from '@ui/app-shell';
import { Button, Card, Form, Progress, Select, Spin, Tag } from 'antd';
import { useState } from 'react';
import { Link } from 'react-router-dom';
import styled from 'styled-components';
import { UI_URLS } from '../../constants';
import { MyDisciplinesItem } from '../../models/MyDisciplinesItem';
import { StudentListItem } from '../../models/StudentListItem';
import { disciplineService } from '../../services/disciplineService';
import { userService } from '../../services/userService';
import { getType } from '../../utils/stringUtils';

export const StudentProgressReportScene = () => {
  const [studentDisciplines, setStudentDisciplines] =
    useState<MyDisciplinesItem[]>();
  const [students, setStudents] = useState<StudentListItem[]>();
  const [isLoading, setIsLoading] = useState(false);
  const [form] = Form.useForm();
  const { loading, loadingHandler } = useLoading();

  useEffectAsync(async () => {
    setIsLoading(true);

    const result = await userService.getStudentList();
    if (result.isSuccessful) {
      setStudents(result.list);
    }

    setIsLoading(false);
  }, []);

  const handleShow = loadingHandler(async () => {
    const { studentId } = await form.validateFields();
    const result = await disciplineService.getStudentDisciplines({
      studentId: studentId,
    });

    if (result.isSuccessful) {
      setStudentDisciplines(result.list);
    }
  });

  return isLoading ? (
    <Spin spinning size="large" />
  ) : students ? (
    <Container>
      <Form form={form} layout="inline">
        <Form.Item
          name="studentId"
          label="Студент"
          rules={[{ required: true, message: 'Выберите студента' }]}
        >
          <Select
            disabled={loading}
            showSearch
            style={{ width: '300px' }}
            placeholder="Выберите студента"
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
            {students.map((s) => (
              <Select.Option key={s.id}>{s.fullName}</Select.Option>
            ))}
          </Select>
        </Form.Item>

        <Button type="primary" onClick={handleShow} loading={loading}>
          Показать
        </Button>
      </Form>
      <CardContainer>
        {studentDisciplines?.map((d) => (
          <Link to={UI_URLS.discipline.view.url(d.id)} className="card">
            <Card
              title={d.name}
              size="small"
              style={{ width: '300px' }}
              hoverable
            >
              <Tag color="magenta">{`${d.semester} семестр`}</Tag>
              <Tag color="gold">{getType(d.type)}</Tag>
              <Progress size="small" percent={d.progress} />
            </Card>
          </Link>
        ))}
      </CardContainer>
    </Container>
  ) : null;
};

const Container = styled.div`
  form {
    padding-bottom: 30px;
  }
`;

const CardContainer = styled.div`
  display: flex;
  flex-wrap: wrap;

  .card {
    margin: 0 20px 20px 0;
  }
`;
