/* eslint-disable @typescript-eslint/no-explicit-any */
import {
  SubGroupType,
  useEffectAsync,
  useLoading,
  useRole,
} from '@ui/app-shell';
import {
  Button,
  DatePicker,
  Form,
  InputNumber,
  List,
  notification,
  Select,
  Spin,
} from 'antd';
import { DeleteOutlined } from '@ant-design/icons';
import moment from 'moment';
import { useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import styled from 'styled-components';
import { UI_URLS } from '../../constants';
import { GetGroupResult } from '../../models/messages/GetGroup';
import { StudentListItem } from '../../models/StudentListItem';
import { groupService } from '../../services/groupService';
import { userService } from '../../services/userService';

export const ViewGroupScene = () => {
  const { groupId } = useParams<{ groupId: string }>();
  const [group, setGroup] = useState<GetGroupResult>();
  const [students, setStudents] = useState<StudentListItem[]>();
  const [isLoading, setIsLoading] = useState(false);
  const [form] = Form.useForm();
  const [addStudentForm] = Form.useForm();
  const { loading, loadingHandler } = useLoading();
  const { isAdmin } = useRole();

  useEffectAsync(async () => {
    setIsLoading(true);

    const result = await groupService.getGroup({ groupId: groupId });
    if (result.isSuccessful) {
      setGroup(result);
    }

    const getStudentListResult = await userService.getStudentWithoutGroupList();
    if (getStudentListResult.isSuccessful) {
      setStudents(getStudentListResult.list);
    }

    setIsLoading(false);
  }, [groupId]);

  const handleUpdate = loadingHandler(async () => {
    const { years, number, headId } = await form.validateFields();

    const result = await groupService.updateGroup({
      groupId: groupId,
      startYear: years[0].year(),
      graduatedYear: years[1].year(),
      number: number,
      headId: headId,
    });

    if (result.isSuccessful) {
      notification.success({ message: 'Группа обновлена' });
    }
  });

  const handleAddStudent = loadingHandler(async () => {
    const { studentId, subGroupType } = await addStudentForm.validateFields();

    const result = await groupService.addGroupStudent({
      groupId: groupId,
      studentId: studentId,
      subGroupType: subGroupType,
    });

    if (result.isSuccessful) {
      notification.success({ message: 'Студент добавлен в группу' });
      const result = await groupService.getGroup({ groupId: groupId });
      if (result.isSuccessful) {
        setGroup(result);
      }

      const getStudentListResult =
        await userService.getStudentWithoutGroupList();
      if (getStudentListResult.isSuccessful) {
        setStudents(getStudentListResult.list);
      }
    }
  });

  const handleRemoveStudent = loadingHandler(async (studentId: string) => {
    const result = await groupService.removeGroupStudent({
      groupId: groupId,
      studentId: studentId,
    });

    if (result.isSuccessful) {
      notification.success({ message: 'Студент удален из группы' });
      const result = await groupService.getGroup({ groupId: groupId });
      if (result.isSuccessful) {
        setGroup(result);
      }

      const getStudentListResult =
        await userService.getStudentWithoutGroupList();
      if (getStudentListResult.isSuccessful) {
        setStudents(getStudentListResult.list);
      }
    }
  });

  return isLoading ? (
    <Spin spinning size="large" />
  ) : group ? (
    <Container>
      <h1>{`${group.specialityShortName} ${group.startYear}-${group.number}`}</h1>
      <Form
        form={form}
        onSubmitCapture={handleUpdate}
        initialValues={{
          years: [
            moment({ year: group.startYear }),
            moment({ year: group.graduatedYear }),
          ],
          number: group.number,
          headId: group.headId,
          specialityId: group.specialityId,
        }}
        labelCol={{ span: 3 }}
      >
        <Form.Item
          name="years"
          label="Период обучения"
          rules={[{ required: true, message: 'Выберите период' }]}
        >
          <DatePicker.RangePicker
            disabled={loading || !isAdmin}
            picker="year"
            placeholder={['Начало', 'Окончание']}
          />
        </Form.Item>

        <Form.Item
          name="number"
          label="Номер группы"
          rules={[
            {
              required: true,
              type: 'number',
              message: 'Введите положительный номер группы',
              min: 1,
            },
          ]}
        >
          <InputNumber disabled={loading || !isAdmin} />
        </Form.Item>

        <Form.Item
          name="headId"
          label="Староста"
          rules={[
            {
              required: true,
              message: 'Выберите старосту',
            },
          ]}
        >
          <Select
            disabled={loading || !isAdmin}
            showSearch
            placeholder="Выберите старосту"
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
            {students?.map((s) => (
              <Select.Option key={s.id}>{s.fullName}</Select.Option>
            ))}
            <Select.Option key={group.headId}>{group.headName}</Select.Option>
          </Select>
        </Form.Item>

        <Form.Item
          name="specialityId"
          label="Специальность"
          rules={[
            {
              required: true,
              message: 'Выберите специальность',
            },
          ]}
        >
          <Select disabled placeholder="Выберите специальность">
            <Select.Option key={group.specialityId}>
              {group.specialityShortName}
            </Select.Option>
          </Select>
        </Form.Item>

        {isAdmin && (
          <div style={{ display: 'flex', justifyContent: 'end' }}>
            <Link
              style={{ marginLeft: 'auto', display: 'block' }}
              to={UI_URLS.group.list}
            >
              <Button type="primary" danger>
                Вернуться к списку
              </Button>
            </Link>
            <Button
              style={{ marginLeft: '5px' }}
              type="primary"
              htmlType="submit"
              loading={loading}
            >
              Изменить
            </Button>
          </div>
        )}
      </Form>
      <div className="list-container">
        <List
          size="large"
          itemLayout="horizontal"
          header="1-ая подгруппа"
          dataSource={group.students.filter(
            (s) => s.subGroupType === SubGroupType.First
          )}
          renderItem={(s) => (
            <List.Item
              actions={[
                isAdmin && (
                  <Button
                    type="text"
                    icon={<DeleteOutlined />}
                    onClick={() => handleRemoveStudent(s.studentId)}
                  />
                ),
              ]}
            >
              <List.Item.Meta
                title={
                  <Link to={UI_URLS.user.view.url(s.studentId)}>
                    {s.studentName}
                  </Link>
                }
              />
            </List.Item>
          )}
        />
        <List
          size="large"
          itemLayout="horizontal"
          header="2-ая подгруппа"
          dataSource={group.students.filter(
            (s) => s.subGroupType === SubGroupType.Second
          )}
          renderItem={(s) => (
            <List.Item
              actions={[
                isAdmin && (
                  <Button
                    type="text"
                    icon={<DeleteOutlined />}
                    onClick={() => handleRemoveStudent(s.studentId)}
                  />
                ),
              ]}
            >
              <List.Item.Meta
                title={
                  <Link to={UI_URLS.user.view.url(s.studentId)}>
                    {s.studentName}
                  </Link>
                }
              />
            </List.Item>
          )}
        />
      </div>
      {isAdmin && (
        <Form form={addStudentForm} layout="inline">
          <Form.Item
            name="studentId"
            label="Студент"
            rules={[
              {
                required: true,
                message: 'Выберите студента',
              },
            ]}
          >
            <Select
              disabled={loading}
              showSearch
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
              {students?.map((s) => (
                <Select.Option key={s.id}>{s.fullName}</Select.Option>
              ))}
            </Select>
          </Form.Item>

          <Form.Item
            name="subGroupType"
            label="Подгруппа"
            rules={[
              {
                required: true,
                message: 'Выберите подгруппу',
              },
            ]}
          >
            <Select disabled={loading} placeholder="Выберите подгруппу">
              <Select.Option key={SubGroupType.First}>Первая</Select.Option>
              <Select.Option key={SubGroupType.Second}>Вторая</Select.Option>
            </Select>
          </Form.Item>

          <Button
            loading={loading}
            className="btn_a"
            type="primary"
            onClick={handleAddStudent}
          >
            Добавить
          </Button>
        </Form>
      )}
    </Container>
  ) : null;
};

const Container = styled.div`
  .list-container {
    display: flex;
    margin-bottom: 20px;

    .ant-list {
      flex: 1;
    }
  }
`;
