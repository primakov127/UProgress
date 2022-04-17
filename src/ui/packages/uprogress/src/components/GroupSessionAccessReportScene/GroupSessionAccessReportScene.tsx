/* eslint-disable @typescript-eslint/no-explicit-any */
import { useEffectAsync, useLoading } from '@ui/app-shell';
import { Button, Form, InputNumber, Select, Spin, Table } from 'antd';
import { useState } from 'react';
import { Link } from 'react-router-dom';
import styled from 'styled-components';
import { UI_URLS } from '../../constants';
import { GroupListItem } from '../../models/GroupListItem';
import { GetGroupSessionAccessResult } from '../../models/messages/GetGroupSessionAccess';
import { assignService } from '../../services/assignService';
import { groupService } from '../../services/groupService';

export const GroupSessionAccessReportScene = () => {
  const [sessionAccess, setSessionAccess] =
    useState<GetGroupSessionAccessResult>();
  const [groups, setGroups] = useState<GroupListItem[]>();
  const [isLoading, setIsLoading] = useState(false);
  const [form] = Form.useForm();
  const { loading, loadingHandler } = useLoading();

  useEffectAsync(async () => {
    setIsLoading(true);

    const groupsResult = await groupService.getGroupList();
    if (groupsResult.isSuccessful) {
      setGroups(groupsResult.list);
    }

    setIsLoading(false);
  }, []);

  const handleShow = loadingHandler(async () => {
    const { semester, groupId } = await form.validateFields();
    const result = await assignService.getGroupSessionAccess({
      groupId: groupId,
      semester: semester,
    });

    if (result.isSuccessful) {
      setSessionAccess(result);
    }
  });

  return isLoading ? (
    <Spin spinning size="large" />
  ) : groups ? (
    <Container>
      <Form form={form} layout="inline">
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

        <Form.Item
          name="semester"
          label="Семестер"
          rules={[
            {
              required: true,
              type: 'number',
              min: 1,
              message: 'Номер семестра',
            },
          ]}
        >
          <InputNumber disabled={loading} />
        </Form.Item>

        <Button type="primary" onClick={handleShow} loading={loading}>
          Показать
        </Button>
      </Form>
      {sessionAccess && (
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
            {
              title: 'Допуск',
              dataIndex: 'access',
              key: 'access',
            },
          ]}
          dataSource={sessionAccess?.students.map((s) => ({
            key: s.studentId,
            name: s.fullName,
            access: s.access ? 'Да' : 'Нет',
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
