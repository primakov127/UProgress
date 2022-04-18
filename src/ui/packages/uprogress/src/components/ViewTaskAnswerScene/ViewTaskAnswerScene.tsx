import {
  AnswerStatus,
  useEffectAsync,
  useRole,
  useLoading,
  UserType,
} from '@ui/app-shell';
import {
  Button,
  Card,
  Descriptions,
  Form,
  Input,
  InputNumber,
  List,
  notification,
  Spin,
  Tag,
} from 'antd';
import axios from 'axios';
import { useState } from 'react';
import ReactMarkdown from 'react-markdown';
import { Link, useParams } from 'react-router-dom';
import remarkGfm from 'remark-gfm';
import styled from 'styled-components';
import { UI_URLS } from '../../constants';
import { GetTaskAnswerResult } from '../../models/messages/GetTaskAnswer';
import { taskAnswerService } from '../../services/taskAnswerService';
import { MarkdownContainer } from '../MarkdownContainer/MarkdownContainer';
import { UserTypeIcon } from '../UserTypeIcon/UserTypeIcon';

export const ViewTaskAnswerScene = () => {
  const { taskAnswerId } = useParams<{ taskAnswerId: string }>();
  const [taskAnswer, setTaskAnswer] = useState<GetTaskAnswerResult>();
  const [isLoading, setIsLoading] = useState(false);
  const { isStudent, isTeacher } = useRole();
  const [form] = Form.useForm();
  const [teacherForm] = Form.useForm();
  const { loading, loadingHandler } = useLoading();

  useEffectAsync(async () => {
    await reloadTaskAnswer();
  }, [taskAnswerId]);

  const reloadTaskAnswer = async () => {
    setIsLoading(true);

    const result = await taskAnswerService.getTaskAnswer({
      taskAnswerId: taskAnswerId,
    });
    if (result.isSuccessful) {
      setTaskAnswer(result);
    }

    setIsLoading(false);
  };

  const handleRequestApprove = loadingHandler(async () => {
    try {
      const { answer, comment } = await form.validateFields();

      const result = await taskAnswerService.requestApprove({
        answer: answer,
        message: comment,
        taskAnswerId: taskAnswerId,
      });

      if (result.isSuccessful) {
        notification.success({ message: 'Ответ отправлен на проверку' });
        await reloadTaskAnswer();
      }
    } catch (e: unknown) {
      if (!axios.isAxiosError(e)) {
        notification.error({ message: 'Проверьте форму' });
      }
    }
  });

  const handleApprove = loadingHandler(async () => {
    try {
      const { comment, mark } = await teacherForm.validateFields();
      console.log(mark);
      const result = await taskAnswerService.approve({
        taskAnswerId: taskAnswerId,
        message: comment,
        mark: mark,
      });

      if (result.isSuccessful) {
        notification.success({ message: 'Ответ одобрен' });
        await reloadTaskAnswer();
      }
    } catch (e: unknown) {
      if (!axios.isAxiosError(e)) {
        notification.error({ message: 'Проверьте отметку' });
      }
    }
  });

  const handleReject = loadingHandler(async () => {
    try {
      const comment = await teacherForm.getFieldValue('comment');
      const result = await taskAnswerService.reject({
        taskAnswerId: taskAnswerId,
        message: comment,
      });

      if (result.isSuccessful) {
        notification.success({ message: 'Ответ отклонен' });
        await reloadTaskAnswer();
      }
    } catch (e: unknown) {
      if (!axios.isAxiosError(e)) {
        notification.error({ message: 'Проверьте форму' });
      }
    }
  });

  const getStatusTag = (status?: AnswerStatus) => {
    switch (status) {
      case AnswerStatus.Draft:
        return <Tag color="purple">Черновик</Tag>;
      case AnswerStatus.Approvable:
        return <Tag color="geekblue">На проверке</Tag>;
      case AnswerStatus.Approved:
        return <Tag color="green">Проверен</Tag>;
      case AnswerStatus.Rejected:
        return <Tag color="volcano">Отклонен</Tag>;
      default:
        return <Tag>Новый</Tag>;
    }
  };

  return isLoading ? (
    <Spin spinning size="large" />
  ) : taskAnswer ? (
    <Container>
      <FormContainer className="form-container">
        <Descriptions
          title={
            <h1>
              Ответ{' '}
              <i>
                {taskAnswer.disciplineName}/{taskAnswer.taskName}:
              </i>
            </h1>
          }
        >
          <Descriptions.Item label="Студент">
            {isTeacher ? (
              <Link to={UI_URLS.user.view.url(taskAnswer.studentId)}>
                {taskAnswer.history[0].user.fullName}
              </Link>
            ) : (
              taskAnswer.history[0].user.fullName
            )}
          </Descriptions.Item>
          <Descriptions.Item label="Дисциплина">
            <Link to={UI_URLS.discipline.view.url(taskAnswer.disciplineId)}>
              {taskAnswer.disciplineName}
            </Link>
          </Descriptions.Item>
          <Descriptions.Item label="Задание">
            <Link
              to={UI_URLS.discipline.viewTask.url(
                taskAnswer.disciplineId,
                taskAnswer.taskId
              )}
            >
              {taskAnswer.taskName}
            </Link>
          </Descriptions.Item>
          <Descriptions.Item label="Статус">
            {getStatusTag(taskAnswer?.status)}
          </Descriptions.Item>
          {taskAnswer.mark && (
            <Descriptions.Item label="Отмека">
              {taskAnswer.mark}
            </Descriptions.Item>
          )}
        </Descriptions>
        <Form
          form={form}
          onSubmitCapture={handleRequestApprove}
          initialValues={{ answer: taskAnswer?.answer }}
          labelCol={{ span: 3 }}
        >
          {isStudent && taskAnswer?.status !== AnswerStatus.Approved && (
            <Form.Item
              name="answer"
              label="Ответ"
              rules={[{ required: true, message: 'Введите ответ' }]}
            >
              <Input.TextArea
                disabled={loading}
                placeholder="Используйте разметку"
                onChange={(e) =>
                  setTaskAnswer((ta) =>
                    ta ? { ...ta, answer: e.target.value } : undefined
                  )
                }
                autoSize={{ minRows: 15, maxRows: 15 }}
              />
            </Form.Item>
          )}

          {isStudent && taskAnswer?.status !== AnswerStatus.Approved && (
            <Form.Item name="comment" label="Комментарий">
              <Input disabled={loading} placeholder="комментарий" />
            </Form.Item>
          )}

          {isStudent && taskAnswer?.status !== AnswerStatus.Approved && (
            <Button
              style={{ marginLeft: 'auto', display: 'block' }}
              type="primary"
              htmlType="submit"
              loading={loading}
            >
              {taskAnswer.status === AnswerStatus.Approvable
                ? 'Изменить'
                : 'Отправить на проверку'}
            </Button>
          )}
        </Form>
        <Card
          title={
            isStudent && taskAnswer?.status !== AnswerStatus.Approved
              ? 'Предпросмотр ответа'
              : 'Ответ'
          }
        >
          <MarkdownContainer>
            <ReactMarkdown
              remarkPlugins={[remarkGfm]}
              className="markdown-body"
            >
              {taskAnswer.answer}
            </ReactMarkdown>
          </MarkdownContainer>
        </Card>
        {isTeacher && (
          <Form form={teacherForm} layout="inline">
            {taskAnswer.status !== AnswerStatus.Approved && (
              <Form.Item name="comment" label="Комментарий" style={{ flex: 1 }}>
                <Input placeholder="Молодец. Все правильно!" />
              </Form.Item>
            )}

            <Form.Item
              name="mark"
              label="Отметка"
              rules={[
                {
                  required: true,
                  type: 'number',
                  message: 'Выше 4!',
                  min: 4,
                },
              ]}
            >
              <InputNumber disabled={loading} placeholder="4" />
            </Form.Item>

            <Button className="btn_a" type="primary" onClick={handleApprove}>
              {taskAnswer.status !== AnswerStatus.Approved
                ? 'Одобрить'
                : 'Изменить'}
            </Button>
            {taskAnswer.status !== AnswerStatus.Rejected && (
              <Button
                className="btn_a"
                type="primary"
                danger
                onClick={handleReject}
              >
                Отклонить
              </Button>
            )}
          </Form>
        )}
      </FormContainer>
      <HistoryContainer>
        <List
          // bordered
          header={<h2>История ответа</h2>}
          dataSource={taskAnswer?.history.sort(($1, $2) =>
            new Date($1.date) > new Date($2.date) ? 1 : -1
          )}
          renderItem={(h) => (
            <List.Item>
              <List.Item.Meta
                avatar={
                  <UserTypeIcon
                    userType={
                      h.statusMovedTo === AnswerStatus.Draft ||
                      h.statusMovedTo === AnswerStatus.Approvable
                        ? UserType.Student
                        : UserType.Teacher
                    }
                  />
                }
                title={h.user.fullName}
                description={h.message}
              />
              {getStatusTag(h.statusMovedTo)}
            </List.Item>
          )}
        />
      </HistoryContainer>
    </Container>
  ) : null;
};

const Container = styled.div`
  display: flex;

  .form-container {
    flex: 1;
  }
`;

const HistoryContainer = styled.div`
  width: 450px;
  padding: 10px 20px;
`;

const FormContainer = styled.div`
  padding: 10px 20px;

  form {
    margin: 20px 0px;

    .btn_a {
      margin-left: 5px;
    }
  }
`;
