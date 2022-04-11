/* eslint-disable @typescript-eslint/no-explicit-any */
import {
  Speciality,
  SubGroupType,
  useEffectAsync,
  useLoading,
} from '@ui/app-shell';
import {
  Button,
  DatePicker,
  Form,
  InputNumber,
  notification,
  Select,
  Transfer,
} from 'antd';
import axios from 'axios';
import { useState } from 'react';
import { Link, useHistory } from 'react-router-dom';
import styled from 'styled-components';
import { UI_URLS } from '../../constants';
import { StudentListItem } from '../../models/StudentListItem';
import { groupService } from '../../services/groupService';
import { userService } from '../../services/userService';

export const AddGroupScene = () => {
  const [form] = Form.useForm();
  const history = useHistory();
  const { loading, loadingHandler } = useLoading();
  const [specialities, setSpecialities] = useState<Speciality[]>();
  const [students, setStudents] = useState<StudentListItem[]>();
  const [selectedStudentKeys, setSelectedStudentKeys] = useState([]);
  const [secondSubGroupStudentKeys, setSecondSubGroupStudentKeys] = useState(
    []
  );

  const studenOptions = students?.map((s) => ({
    key: s.id,
    title: s.fullName,
    chosen: false,
  }));

  const studentSubGroupOptions = studenOptions?.filter((so) =>
    selectedStudentKeys.includes(so.key as never)
  );

  const handleStudentsTransfer = (targetKeys: any) => {
    setSelectedStudentKeys(targetKeys as unknown as []);
  };

  const handleSubgroupTransfer = (targetKeys: any) => {
    setSecondSubGroupStudentKeys(targetKeys as unknown as []);
  };

  useEffectAsync(async () => {
    const getSpecialityListResult = await groupService.getSpecialityList();
    if (getSpecialityListResult.isSuccessful) {
      setSpecialities(getSpecialityListResult.list);
    }

    const getStudentListResult = await userService.getStudentList();
    if (getStudentListResult.isSuccessful) {
      setStudents(getStudentListResult.list);
    }
  }, []);

  const handleAdd = loadingHandler(async () => {
    try {
      const {
        years,
        number,
        headId,
        specialityId,
        students,
        secondSubGroupStudents,
      } = await form.validateFields();

      const studentList = (students as string[]).map((id) => ({
        studentId: id,
        subGroupType: (secondSubGroupStudents as string[]).includes(id)
          ? SubGroupType.Second
          : SubGroupType.First,
      }));

      const result = await groupService.createGroup({
        startYear: years[0].year(),
        graduatedYear: years[1].year(),
        number: number,
        headId: headId,
        specialityId: specialityId,
        students: studentList,
      });

      if (result.isSuccessful) {
        notification.success({ message: 'Группа успешно создана' });
        history.push(UI_URLS.group.list);
      }
    } catch (e: unknown) {
      if (!axios.isAxiosError(e)) {
        notification.error({ message: 'Проверьте форму' });
      }
    }
  });

  return (
    <Container>
      <Form form={form} onSubmitCapture={handleAdd}>
        <Form.Item
          name="years"
          label="Период обучения"
          rules={[{ required: true, message: 'Выберите период' }]}
        >
          <DatePicker.RangePicker
            disabled={loading}
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
          <InputNumber disabled={loading} />
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
            disabled={loading}
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
          <Select
            showSearch
            disabled={loading}
            placeholder="Выберите специальность"
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
            {specialities?.map((s) => (
              <Select.Option key={s.id}>{s.shortName}</Select.Option>
            ))}
          </Select>
        </Form.Item>

        <Form.Item
          name="students"
          label="Студенты"
          rules={[
            {
              required: true,
              message: 'Выберите хотя бы одного студента',
            },
          ]}
        >
          <Transfer
            titles={['Все студенты', 'Студенты в группе']}
            showSelectAll={false}
            locale={{
              itemUnit: '',
              itemsUnit: '',
              searchPlaceholder: 'Поиск студентов',
            }}
            dataSource={studenOptions}
            disabled={loading}
            showSearch
            operations={['Добавить', 'Убрать']}
            render={(item) => `${item.title}`}
            targetKeys={selectedStudentKeys}
            onChange={handleStudentsTransfer}
          />
        </Form.Item>

        <Form.Item
          name="secondSubGroupStudents"
          label="Подгруппа"
          rules={[
            {
              required: true,
              message: 'Выберите хотя бы одного студента',
            },
          ]}
        >
          <Transfer
            titles={['1 подгруппа', '2 подгруппа']}
            showSelectAll={false}
            locale={{
              itemUnit: '',
              itemsUnit: '',
              searchPlaceholder: 'Поиск студентов',
            }}
            dataSource={studentSubGroupOptions}
            disabled={loading}
            showSearch
            operations={['2', '1']}
            render={(item) => `${item.title}`}
            targetKeys={secondSubGroupStudentKeys}
            onChange={handleSubgroupTransfer}
          />
        </Form.Item>

        <Button block type="primary" htmlType="submit" loading={loading}>
          Создать
        </Button>
        <Link to={UI_URLS.group.list}>
          <Button type="primary" danger>
            Вернуться к списку
          </Button>
        </Link>
      </Form>
    </Container>
  );
};

const Container = styled.div``;
