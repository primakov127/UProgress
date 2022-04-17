/* eslint-disable @typescript-eslint/no-explicit-any */
import {
  Discipline,
  DisciplineType,
  Speciality,
  useEffectAsync,
  useLoading,
  useRole,
} from '@ui/app-shell';
import {
  Button,
  Card,
  Descriptions,
  Form,
  Input,
  InputNumber,
  List,
  Modal,
  notification,
  Radio,
  Select,
  Spin,
  Tag,
} from 'antd';
import { DeleteOutlined, PlusOutlined } from '@ant-design/icons';
import { useState } from 'react';
import ReactMarkdown from 'react-markdown';
import { Link, useHistory, useParams } from 'react-router-dom';
import remarkGfm from 'remark-gfm';
import styled from 'styled-components';
import { UI_URLS } from '../../constants';
import { disciplineService } from '../../services/disciplineService';
import { groupService } from '../../services/groupService';
import { MarkdownContainer } from '../MarkdownContainer/MarkdownContainer';
import { getType } from '../../utils/stringUtils';

export const ViewDisciplineScene = () => {
  const [form] = Form.useForm();
  const history = useHistory();
  const { disciplineId } = useParams<{ disciplineId: string }>();
  const [discipline, setDiscipline] = useState<Discipline>();
  const [specialities, setSpecialities] = useState<Speciality[]>();
  const { loading, loadingHandler } = useLoading();
  const [isLoading, setIsLoading] = useState(false);
  const { isAdmin } = useRole();

  useEffectAsync(async () => {
    setIsLoading(true);

    const result = await disciplineService.getDiscipline({
      disciplineId: disciplineId,
    });
    if (result.isSuccessful) {
      setDiscipline(result);
    }

    const getSpecialityListResult = await groupService.getSpecialityList();
    if (getSpecialityListResult.isSuccessful) {
      setSpecialities(getSpecialityListResult.list);
    }

    setIsLoading(false);
  }, [disciplineId]);

  const showTaskDeleteConfirm = (id: string, name: string) => {
    Modal.confirm({
      title: `Вы хотите удалить задание: ${name} ?`,
      onOk: async () => {
        const result = await disciplineService.deleteTask({
          taskId: id,
        });
        if (result.isSuccessful) {
          notification.success({ message: 'Задание успешно удалено' });

          const discipline = await disciplineService.getDiscipline({
            disciplineId: disciplineId,
          });
          setDiscipline(discipline);
          return;
        }

        notification.error({ message: 'Не удалось удалить задание' });
      },
    });
  };

  return isLoading ? (
    <Spin spinning size="large" />
  ) : discipline ? (
    <Container>
      {isAdmin && (
        <Form
          form={form}
          onSubmitCapture={() => console.log('ViewDisciplineScene Add')}
          initialValues={{
            name: discipline?.name,
            semester: discipline?.semester,
            specialityId: discipline?.specialityId,
            type: discipline?.type,
            description: discipline?.description,
          }}
        >
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
              onChange={(e) =>
                setDiscipline((d) =>
                  d ? { ...d, description: e.target.value } : undefined
                )
              }
              autoSize={{ minRows: 15, maxRows: 15 }}
            />
          </Form.Item>

          <Button block type="primary" htmlType="submit" loading={loading}>
            Создать
          </Button>
          <Link to={UI_URLS.discipline.list}>
            <Button type="primary" danger>
              Вернуться к списку
            </Button>
          </Link>
        </Form>
      )}
      {!isAdmin && (
        <Descriptions
          title={
            <h1>
              Дисциплина: <i>{discipline.name}</i>
            </h1>
          }
        >
          <Descriptions.Item label="Семестр">
            <Tag color="magenta">{`${discipline.semester} семестр`}</Tag>
          </Descriptions.Item>
          <Descriptions.Item label="Тип">
            <Tag color="gold">{getType(discipline.type)}</Tag>
          </Descriptions.Item>
          <Descriptions.Item label="Специальность">
            <Tag color="geekblue">{discipline.speciality?.shortName}</Tag>
          </Descriptions.Item>
        </Descriptions>
      )}
      <Card
        title={<h2>{isAdmin ? 'Предпросмотр описания:' : 'Описание:'}</h2>}
        bordered={false}
      >
        <MarkdownContainer>
          <ReactMarkdown remarkPlugins={[remarkGfm]} className="markdown-body">
            {discipline.description}
          </ReactMarkdown>
        </MarkdownContainer>
      </Card>

      <Card bordered={false} title={<h2>Задания:</h2>}>
        <List
          size="large"
          itemLayout="horizontal"
          dataSource={discipline.tasks}
          renderItem={(t) => (
            <List.Item
              actions={
                isAdmin
                  ? [
                      <Button
                        type="text"
                        icon={<DeleteOutlined />}
                        onClick={() => showTaskDeleteConfirm(t.id, t.name)}
                      />,
                    ]
                  : []
              }
            >
              <List.Item.Meta
                title={
                  <Link
                    to={UI_URLS.discipline.viewTask.url(discipline.id, t.id)}
                  >
                    {t.name}
                  </Link>
                }
                description={
                  t.isRequired ? (
                    <Tag color="volcano">Обязательно</Tag>
                  ) : undefined
                }
              />
            </List.Item>
          )}
        />
        {isAdmin && (
          <div style={{ textAlign: 'center' }}>
            <Link to={UI_URLS.discipline.addTask.url(discipline.id)}>
              <Button type="dashed" icon={<PlusOutlined />}>
                Добавить задание
              </Button>
            </Link>
          </div>
        )}
      </Card>
    </Container>
  ) : null;
};

const Container = styled.div`
  .ant-card-head {
    padding: 0;
  }
`;
