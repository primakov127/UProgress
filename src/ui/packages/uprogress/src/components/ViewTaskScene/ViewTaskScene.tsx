import { Task, useEffectAsync, useLoading } from '@ui/app-shell';
import { Button, Card, Form, Input, Switch } from 'antd';
import { useState } from 'react';
import ReactMarkdown from 'react-markdown';
import { Link, useHistory, useParams } from 'react-router-dom';
import remarkGfm from 'remark-gfm';
import styled from 'styled-components';
import { UI_URLS } from '../../constants';
import { disciplineService } from '../../services/disciplineService';
import { MarkdownContainer } from '../MarkdownContainer/MarkdownContainer';

export const ViewTaskScene = () => {
  const [form] = Form.useForm();
  const { disciplineId, taskId } = useParams<{
    disciplineId: string;
    taskId: string;
  }>();
  const history = useHistory();
  const { loading, loadingHandler } = useLoading();
  const [task, setTask] = useState<Task>();

  useEffectAsync(async () => {
    const result = await disciplineService.getTask({
      taskId: taskId,
    });
    if (result.isSuccessful) {
      setTask(result);
    }
  }, [taskId]);

  return (
    <Container>
      {task && (
        <Form
          form={form}
          onSubmitCapture={() => console.log('ViewTaskScene Add')}
          initialValues={{
            name: task?.name,
            isRequired: task?.isRequired,
            description: task?.description,
          }}
        >
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
              onChange={(e) =>
                setTask((t) =>
                  t ? { ...t, description: e.target.value } : undefined
                )
              }
              autoSize={{ minRows: 15, maxRows: 15 }}
            />
          </Form.Item>

          <Card title="Предпросмотр задания">
            <MarkdownContainer>
              <ReactMarkdown
                remarkPlugins={[remarkGfm]}
                className="markdown-body"
              >
                {task.description}
              </ReactMarkdown>
            </MarkdownContainer>
          </Card>

          <Button block type="primary" htmlType="submit" loading={loading}>
            Создать
          </Button>
          <Link to={UI_URLS.discipline.view.url(disciplineId)}>
            <Button type="primary" danger>
              Вернуться к дисциплине
            </Button>
          </Link>
        </Form>
      )}
    </Container>
  );
};

const Container = styled.div``;
