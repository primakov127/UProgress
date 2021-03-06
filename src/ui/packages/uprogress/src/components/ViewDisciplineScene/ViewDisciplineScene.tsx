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

  const handleUpdate = loadingHandler(async () => {
    const { name, description, semester, type, specialityId } =
      await form.validateFields();

    const result = await disciplineService.updateDiscipline({
      id: disciplineId,
      name: name,
      description: description,
      semester: semester,
      type: type,
      specialityId: specialityId,
    });

    if (result.isSuccessful) {
      notification.success({ message: '???????????????????? ??????????????????' });
    }
  });

  const showTaskDeleteConfirm = (id: string, name: string) => {
    Modal.confirm({
      title: `???? ???????????? ?????????????? ??????????????: ${name} ?`,
      onOk: async () => {
        const result = await disciplineService.deleteTask({
          taskId: id,
        });
        if (result.isSuccessful) {
          notification.success({ message: '?????????????? ?????????????? ??????????????' });

          const discipline = await disciplineService.getDiscipline({
            disciplineId: disciplineId,
          });
          setDiscipline(discipline);
          return;
        }

        notification.error({ message: '???? ?????????????? ?????????????? ??????????????' });
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
          onSubmitCapture={handleUpdate}
          initialValues={{
            name: discipline?.name,
            semester: discipline?.semester,
            specialityId: discipline?.specialityId,
            type: discipline?.type,
            description: discipline?.description,
          }}
          labelCol={{ span: 3 }}
        >
          <Form.Item
            name="name"
            label="????????????????"
            rules={[{ required: true, message: '?????????????? ????????????????' }]}
          >
            <Input disabled={loading} placeholder="???????? ????????????" />
          </Form.Item>

          <Form.Item
            name="semester"
            label="??????????????"
            rules={[
              {
                required: true,
                type: 'number',
                message: '?????????????? ?????????????????????????? ?????????? ????????????????',
                min: 1,
              },
            ]}
          >
            <InputNumber disabled={loading} />
          </Form.Item>

          <Form.Item
            name="specialityId"
            label="??????????????????????????"
            rules={[
              {
                required: true,
                message: '???????????????? ??????????????????????????',
              },
            ]}
          >
            <Select
              showSearch
              disabled={loading}
              placeholder="???????????????? ??????????????????????????"
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
            label="?????? ????????????????????"
            rules={[
              {
                required: true,
                message: '???????????????? ?????? ????????????????????',
              },
            ]}
          >
            <Radio.Group buttonStyle="solid" disabled={loading}>
              <Radio.Button value={DisciplineType.Exam}>??????????????</Radio.Button>
              <Radio.Button defaultChecked value={DisciplineType.NoMark}>
                ??????????
              </Radio.Button>
              <Radio.Button defaultChecked value={DisciplineType.Mark}>
                ???????????????????????????????????? ??????????
              </Radio.Button>
              <Radio.Button defaultChecked value={DisciplineType.Project}>
                ???????????????? ????????????
              </Radio.Button>
              <Radio.Button value={DisciplineType.Free}>
                ?????? ???????????????? ??????????????
              </Radio.Button>
            </Radio.Group>
          </Form.Item>

          <Form.Item
            name="description"
            label="????????????????"
            rules={[{ required: true, message: '?????????????? ????????????????' }]}
          >
            <Input.TextArea
              disabled={loading}
              placeholder="?????????????????????? ????????????????"
              onChange={(e) =>
                setDiscipline((d) =>
                  d ? { ...d, description: e.target.value } : undefined
                )
              }
              autoSize={{ minRows: 15, maxRows: 15 }}
            />
          </Form.Item>

          <div style={{ display: 'flex', justifyContent: 'end' }}>
            <Link
              to={UI_URLS.discipline.list}
              style={{ marginLeft: 'auto', display: 'block' }}
            >
              <Button type="primary" danger>
                ?????????????????? ?? ????????????
              </Button>
            </Link>
            <Button
              style={{ marginLeft: '5px' }}
              type="primary"
              htmlType="submit"
              loading={loading}
            >
              ????????????????
            </Button>
          </div>
        </Form>
      )}
      {!isAdmin && (
        <Descriptions
          title={
            <h1>
              ????????????????????: <i>{discipline.name}</i>
            </h1>
          }
        >
          <Descriptions.Item label="??????????????">
            <Tag color="magenta">{`${discipline.semester} ??????????????`}</Tag>
          </Descriptions.Item>
          <Descriptions.Item label="??????">
            <Tag color="gold">{getType(discipline.type)}</Tag>
          </Descriptions.Item>
          <Descriptions.Item label="??????????????????????????">
            <Tag color="geekblue">{discipline.speciality?.shortName}</Tag>
          </Descriptions.Item>
        </Descriptions>
      )}
      <Card
        title={<h2>{isAdmin ? '???????????????????????? ????????????????:' : '????????????????:'}</h2>}
        bordered={false}
      >
        <MarkdownContainer>
          <ReactMarkdown remarkPlugins={[remarkGfm]} className="markdown-body">
            {discipline.description}
          </ReactMarkdown>
        </MarkdownContainer>
      </Card>

      <Card bordered={false} title={<h2>??????????????:</h2>}>
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
                    <Tag color="volcano">??????????????????????</Tag>
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
                ???????????????? ??????????????
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
