import { useLoading } from '@ui/app-shell';
import { Button, Card, Form, Input, notification, Switch } from 'antd';
import axios from 'axios';
import { useState } from 'react';
import ReactMarkdown from 'react-markdown';
import { Link, useHistory, useParams } from 'react-router-dom';
import remarkGfm from 'remark-gfm';
import styled from 'styled-components';
import { UI_URLS } from '../../constants';
import { disciplineService } from '../../services/disciplineService';
import { MarkdownContainer } from '../MarkdownContainer/MarkdownContainer';

export const AddTaskScene = () => {
  const { disciplineId } = useParams<{ disciplineId: string }>();
  const [form] = Form.useForm();
  const history = useHistory();
  const { loading, loadingHandler } = useLoading();
  const [markdonw, setMarkdown] = useState<string>(
    '[Синтаксис разметки](https://commonmark.org/help/)'
  );

  const handleAdd = loadingHandler(async () => {
    try {
      const { name, description, isRequired } = await form.validateFields();

      const result = await disciplineService.createTask({
        disciplineId: disciplineId,
        name: name,
        description: description,
        isRequired: isRequired,
      });

      if (result.isSuccessful) {
        notification.success({ message: 'Задание успешно создано' });
        history.push(UI_URLS.discipline.view.url(disciplineId));
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

        <Form.Item name="isRequired" label="Обязательно для выполнения">
          <Switch
            disabled={loading}
            checkedChildren="Да"
            unCheckedChildren="Нет"
          />
        </Form.Item>

        <Form.Item
          name="description"
          label="Задание"
          rules={[{ required: true, message: 'Введите описание' }]}
        >
          <Input.TextArea
            disabled={loading}
            placeholder="Используйте разметку"
            onChange={(e) => setMarkdown(e.target.value)}
            autoSize={{ minRows: 15, maxRows: 15 }}
          />
        </Form.Item>

        <Card title="Предпросмотр задания">
          <MarkdownContainer>
            <ReactMarkdown
              remarkPlugins={[remarkGfm]}
              className="markdown-body"
            >
              {markdonw}
            </ReactMarkdown>
          </MarkdownContainer>
        </Card>

        <div
          style={{ display: 'flex', justifyContent: 'end', marginTop: '20px' }}
        >
          <Link
            style={{ marginLeft: 'auto', display: 'block' }}
            to={UI_URLS.discipline.view.url(disciplineId)}
          >
            <Button type="primary" danger>
              Вернуться к дисциплине
            </Button>
          </Link>
          <Button
            style={{ marginLeft: '5px' }}
            type="primary"
            htmlType="submit"
            loading={loading}
          >
            Создать
          </Button>
        </div>
      </Form>
    </Container>
  );
};

const Container = styled.div``;
