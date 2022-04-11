/* eslint-disable @typescript-eslint/no-explicit-any */
import { DisciplineType, useEffectAsync, useLoading } from '@ui/app-shell';
import {
  Button,
  Card,
  Form,
  Input,
  InputNumber,
  notification,
  Radio,
  Select,
} from 'antd';
import axios from 'axios';
import { useState } from 'react';
import ReactMarkdown from 'react-markdown';
import { Link, useHistory } from 'react-router-dom';
import styled from 'styled-components';
import { UI_URLS } from '../../constants';
import { Speciality } from '../../models/Speciality';
import { disciplineService } from '../../services/disciplineService';
import { groupService } from '../../services/groupService';
import remarkGfm from 'remark-gfm';
import { MarkdownContainer } from '../MarkdownContainer/MarkdownContainer';

export const AddDisciplineScene = () => {
  const [form] = Form.useForm();
  const history = useHistory();
  const { loading, loadingHandler } = useLoading();
  const [specialities, setSpecialities] = useState<Speciality[]>();
  const [markdonw, setMarkdown] = useState<string>(
    '[Синтаксис разметки](https://commonmark.org/help/)'
  );

  useEffectAsync(async () => {
    const getSpecialityListResult = await groupService.getSpecialityList();
    if (getSpecialityListResult.isSuccessful) {
      setSpecialities(getSpecialityListResult.list);
    }
  }, []);

  const handleAdd = loadingHandler(async () => {
    try {
      const { name, description, semester, type, specialityId } =
        await form.validateFields();

      const result = await disciplineService.createDiscipline({
        name: name,
        description: description,
        semester: semester,
        type: type,
        specialityId: specialityId,
      });

      if (result.isSuccessful) {
        notification.success({ message: 'Дисциплина успешно создана' });
        history.push(UI_URLS.discipline.list);
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
          name="name"
          label="Название"
          rules={[{ required: true, message: 'Введите название' }]}
        >
          <Input disabled={loading} placeholder="Базы данных" />
        </Form.Item>

        <Form.Item
          name="semester"
          label="Семестр"
          rules={[
            {
              required: true,
              type: 'number',
              message: 'Введите положительный номер семестра',
              min: 1,
            },
          ]}
        >
          <InputNumber disabled={loading} />
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
          name="type"
          label="Тип дисциплины"
          rules={[
            {
              required: true,
              message: 'Выберите тип дисциплины',
            },
          ]}
        >
          <Radio.Group buttonStyle="solid" disabled={loading}>
            <Radio.Button value={DisciplineType.Exam}>Экзамен</Radio.Button>
            <Radio.Button defaultChecked value={DisciplineType.NoMark}>
              Зачет
            </Radio.Button>
            <Radio.Button defaultChecked value={DisciplineType.Mark}>
              Дифференцированный зачет
            </Radio.Button>
            <Radio.Button defaultChecked value={DisciplineType.Project}>
              Курсовой проект
            </Radio.Button>
            <Radio.Button value={DisciplineType.Free}>
              Без итоговой отметки
            </Radio.Button>
          </Radio.Group>
        </Form.Item>

        <Form.Item
          name="description"
          label="Описание"
          rules={[{ required: true, message: 'Введите описание' }]}
        >
          <Input.TextArea
            disabled={loading}
            placeholder="Используйте разметку"
            onChange={(e) => setMarkdown(e.target.value)}
            autoSize={{ minRows: 15, maxRows: 15 }}
          />
        </Form.Item>

        <Card title="Предпросмотр описания">
          <MarkdownContainer>
            <ReactMarkdown
              remarkPlugins={[remarkGfm]}
              className="markdown-body"
            >
              {markdonw}
            </ReactMarkdown>
          </MarkdownContainer>
        </Card>

        <Button block type="primary" htmlType="submit" loading={loading}>
          Создать
        </Button>
        <Link to={UI_URLS.discipline.list}>
          <Button type="primary" danger>
            Вернуться к списку
          </Button>
        </Link>
      </Form>
    </Container>
  );
};

const Container = styled.div``;
