import { useEffectAsync, useLoading, useRole } from '@ui/app-shell';
import {
  Button,
  Card,
  Descriptions,
  Form,
  Input,
  Spin,
  Switch,
  Tag,
} from 'antd';
import { useState } from 'react';
import ReactMarkdown from 'react-markdown';
import { Link, useHistory, useParams } from 'react-router-dom';
import remarkGfm from 'remark-gfm';
import styled from 'styled-components';
import { UI_URLS } from '../../constants';
import { GetTaskResult } from '../../models/messages/GetTask';
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
  const [task, setTask] = useState<GetTaskResult>();
  const [isLoading, setIsLoading] = useState(false);
  const { isAdmin, isStudent } = useRole();

  useEffectAsync(async () => {
    setIsLoading(true);

    const result = await disciplineService.getTask({
      taskId: taskId,
    });
    if (result.isSuccessful) {
      setTask(result);
    }

    setIsLoading(false);
  }, [taskId]);

  return isLoading ? (
    <Spin spinning size="large" />
  ) : task ? (
    <Container>
      {isAdmin && (
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

          <div style={{ display: 'flex', justifyContent: 'end' }}>
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
              Изменить
            </Button>
          </div>
        </Form>
      )}
      {!isAdmin && (
        <Descriptions
          title={
            <h1>
              Задание: <i>{task.name}</i>
              {isStudent && (
                <Link
                  to={
                    task.taskAnswerId
                      ? UI_URLS.taskAnswer.view.url(task.taskAnswerId)
                      : UI_URLS.taskAnswer.add.url(taskId)
                  }
                  style={{ float: 'right' }}
                >
                  <Button type="primary">
                    {task.taskAnswerId ? 'Мой ответ' : 'Создать ответ'}
                  </Button>
                </Link>
              )}
            </h1>
          }
        >
          <Descriptions.Item label="Обязательно">
            {task.isRequired ? (
              <Tag color="volcano">Да</Tag>
            ) : (
              <Tag color="green">Нет</Tag>
            )}
          </Descriptions.Item>
          <Descriptions.Item label="Дисциплина">
            <Link to={UI_URLS.discipline.view.url(task.disciplineId)}>
              {task.disciplineName}
            </Link>
          </Descriptions.Item>
        </Descriptions>
      )}
      <Card
        title={<h2>{isAdmin ? 'Предпросмотр задания:' : 'Задание:'}</h2>}
        bordered={false}
      >
        <MarkdownContainer>
          <ReactMarkdown remarkPlugins={[remarkGfm]} className="markdown-body">
            {task.description}
          </ReactMarkdown>
        </MarkdownContainer>
      </Card>
    </Container>
  ) : null;
};

const Container = styled.div``;
