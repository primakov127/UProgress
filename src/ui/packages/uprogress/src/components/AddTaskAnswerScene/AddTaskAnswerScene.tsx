import { useEffectAsync, useLoading, userState } from '@ui/app-shell';
import { Button, Card, Descriptions, Form, Input, notification } from 'antd';
import axios from 'axios';
import { useState } from 'react';
import ReactMarkdown from 'react-markdown';
import { Link, useHistory, useParams } from 'react-router-dom';
import { useRecoilValue } from 'recoil';
import remarkGfm from 'remark-gfm';
import styled from 'styled-components';
import { UI_URLS } from '../../constants';
import { GetTaskResult } from '../../models/messages/GetTask';
import { disciplineService } from '../../services/disciplineService';
import { taskAnswerService } from '../../services/taskAnswerService';
import { MarkdownContainer } from '../MarkdownContainer/MarkdownContainer';

export const AddTaskAnswerScene = () => {
  const { taskId } = useParams<{ taskId: string }>();
  const [form] = Form.useForm();
  const history = useHistory();
  const { loading, loadingHandler } = useLoading();
  const [task, setTask] = useState<GetTaskResult>();
  const currentUser = useRecoilValue(userState);
  const [markdonw, setMarkdown] = useState<string>(
    '[Синтаксис разметки](https://commonmark.org/help/)'
  );

  useEffectAsync(async () => {
    const result = await disciplineService.getTask({
      taskId: taskId,
    });
    if (result.isSuccessful) {
      setTask(result);
    }
  }, [taskId]);

  const handleAdd = loadingHandler(async () => {
    try {
      const { answer } = await form.validateFields();

      const result = await taskAnswerService.createTaskAnswer({
        answer: answer,
        studentId: currentUser?.id as string,
        taskId: taskId,
      });

      if (result.isSuccessful) {
        notification.success({ message: 'Ответ успешшно создан' });
        history.push(UI_URLS.taskAnswer.view.url(result.taskAnswerId));
      }
    } catch (e: unknown) {
      if (!axios.isAxiosError(e)) {
        notification.error({ message: 'Проверьте форму' });
      }
    }
  });

  return (
    <Container>
      <Descriptions
        title={
          <h1>
            Ответ{' '}
            <i>
              {task?.disciplineName}/{task?.name}
            </i>
            :
          </h1>
        }
      >
        <Descriptions.Item label="Дисциплина">
          <Link to={UI_URLS.discipline.view.url(task?.disciplineId ?? '')}>
            {task?.disciplineName}
          </Link>
        </Descriptions.Item>
        <Descriptions.Item label="Задание">
          <Link
            to={UI_URLS.discipline.viewTask.url(
              task?.disciplineId ?? '',
              taskId
            )}
          >
            {task?.name}
          </Link>
        </Descriptions.Item>
      </Descriptions>
      <Form form={form} onSubmitCapture={handleAdd}>
        <Form.Item
          name="answer"
          label="Ответ"
          rules={[{ required: true, message: 'Введите ответ' }]}
        >
          <Input.TextArea
            disabled={loading}
            placeholder="Используйте разметку"
            onChange={(e) => setMarkdown(e.target.value)}
            autoSize={{ minRows: 15, maxRows: 15 }}
          />
        </Form.Item>

        <div style={{ display: 'flex', justifyContent: 'end' }}>
          <Link
            to={UI_URLS.discipline.viewTask.url(
              task?.disciplineId ?? '',
              taskId
            )}
          >
            <Button type="primary" danger>
              Вернуться к заданию
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

      <Card title="Предпросмотр ответа" bordered={false}>
        <MarkdownContainer>
          <ReactMarkdown remarkPlugins={[remarkGfm]} className="markdown-body">
            {markdonw}
          </ReactMarkdown>
        </MarkdownContainer>
      </Card>
    </Container>
  );
};

const Container = styled.div``;
