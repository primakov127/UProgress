/* eslint-disable @typescript-eslint/no-explicit-any */
import { useLoading } from '@ui/app-shell';
import { Button, Form, notification, Select } from 'antd';
import axios from 'axios';
import { DisciplineListItem } from '../../models/DisciplineListItem';
import { StudentListItem } from '../../models/StudentListItem';
import { assignService } from '../../services/assignService';

type Props = {
  disciplines: DisciplineListItem[];
  students: StudentListItem[];
  cb: () => void;
};

export const AssignToStudent = ({ disciplines, students, cb }: Props) => {
  const [form] = Form.useForm();
  const { loading, loadingHandler } = useLoading();

  const handleAssign = loadingHandler(async () => {
    try {
      const { disciplineId, studentId } = await form.validateFields();

      const result = await assignService.assignDisciplineToStudent({
        disciplineId: disciplineId,
        studentId: studentId,
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
        name="studentId"
        label="Студент"
        rules={[{ required: true, message: 'Выберите студента' }]}
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
          {students.map((s) => (
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
