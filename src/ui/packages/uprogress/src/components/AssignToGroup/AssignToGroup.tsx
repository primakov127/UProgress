/* eslint-disable @typescript-eslint/no-explicit-any */
import { useLoading } from '@ui/app-shell';
import { Button, Form, notification, Select } from 'antd';
import axios from 'axios';
import { DisciplineListItem } from '../../models/DisciplineListItem';
import { GroupListItem } from '../../models/GroupListItem';
import { StudentListItem } from '../../models/StudentListItem';
import { assignService } from '../../services/assignService';

type Props = {
  disciplines: DisciplineListItem[];
  groups: GroupListItem[];
  teachers: StudentListItem[];
  cb: () => void;
};

export const AssignToGroup = ({ disciplines, groups, teachers, cb }: Props) => {
  const [form] = Form.useForm();
  const { loading, loadingHandler } = useLoading();

  const handleAssign = loadingHandler(async () => {
    try {
      const { disciplineId, groupId, firstTeacherId, secondTeacherId } =
        await form.validateFields();

      const result = await assignService.assignDisciplineToGroup({
        disciplineId: disciplineId,
        groupId: groupId,
        firstSubGroupTeacherId: firstTeacherId,
        secondSubGroupTeacherId: secondTeacherId,
      });

      if (result.isSuccessful) {
        notification.success({ message: 'Дисциплина успешно назначена' });
        cb();
      }
    } catch (e: unknown) {
      if (!axios.isAxiosError(e)) {
        notification.error({ message: 'Проверьте форму' });
        cb();
      }
    }
  });

  return (
    <Form form={form} onSubmitCapture={handleAssign}>
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

      <Form.Item
        name="firstTeacherId"
        label="Преподаватель 1 подгруппа"
        rules={[{ required: true, message: 'Выберите преподавателя' }]}
      >
        <Select
          disabled={loading}
          showSearch
          placeholder="Выберите преподавателя"
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
          {teachers.map((s) => (
            <Select.Option key={s.id}>{s.fullName}</Select.Option>
          ))}
        </Select>
      </Form.Item>

      <Form.Item name="secondTeacherId" label="Преподаватель 2 подгруппа">
        <Select
          disabled={loading}
          showSearch
          placeholder="Выберите преподавателя"
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
          {teachers.map((s) => (
            <Select.Option key={s.id}>{s.fullName}</Select.Option>
          ))}
        </Select>
      </Form.Item>

      <Button block type="primary" htmlType="submit" loading={loading}>
        Назначить
      </Button>
    </Form>
  );
};
