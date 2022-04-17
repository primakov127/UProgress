import { useLoading, UserRole, UserType } from '@ui/app-shell';
import { Button, Form, Input, notification, Radio, Select } from 'antd';
import axios from 'axios';
import { useState } from 'react';
import { Link, useHistory } from 'react-router-dom';
import styled from 'styled-components';
import { UI_URLS } from '../../constants';
import { userService } from '../../services/userService';

export const AddUserScene = () => {
  const [form] = Form.useForm();
  const history = useHistory();
  const { loading, loadingHandler } = useLoading();
  const [userType, setUserType] = useState<UserType>();

  const handleAdd = loadingHandler(async () => {
    try {
      const values = await form.validateFields();
      const result = await userService.createUser({
        fullName: values.fullName,
        username: values.username,
        email: values.email,
        phone: values.phone,
        password: values.password,
        userType: values.userType,
        userRoles: values.roles,
      });

      if (result.isSuccessful) {
        notification.success({ message: 'Пользователь успешно создан' });
        history.push(UI_URLS.user.list);
      }
    } catch (e: unknown) {
      if (!axios.isAxiosError(e)) {
        notification.error({ message: 'Проверьте форму' });
      }
    }
  });

  return (
    <Container>
      <Form form={form} onSubmitCapture={handleAdd} labelCol={{ span: 2 }}>
        <Form.Item
          name="fullName"
          label="ФИО"
          rules={[{ required: true, message: 'Введите ФИО' }]}
        >
          <Input disabled={loading} placeholder="Иванов Иван Иванович" />
        </Form.Item>

        <Form.Item
          name="username"
          label="Username"
          rules={[{ required: true, message: 'Введите Username' }]}
        >
          <Input disabled={loading} placeholder="user12345" />
        </Form.Item>

        <Form.Item name="phone" label="Номер телефона">
          <Input disabled={loading} placeholder="+375447843293" />
        </Form.Item>

        <Form.Item
          name="email"
          label="Email"
          rules={[
            {
              required: true,
              type: 'email',
              message: 'Введите корректный email',
            },
          ]}
        >
          <Input disabled={loading} placeholder="example@gmail.com" />
        </Form.Item>

        <Form.Item
          name="password"
          label="Пароль"
          rules={[{ required: true, message: 'Введите Пароль' }]}
        >
          <Input disabled={loading} placeholder="pa$$w0rD" />
        </Form.Item>

        <Form.Item
          name="userType"
          label="Тип аккаунта"
          rules={[
            {
              required: true,
              message: 'Выберите тип аккаунта',
            },
          ]}
        >
          <Radio.Group
            buttonStyle="solid"
            disabled={loading}
            onChange={(e) => setUserType(e.target.value)}
          >
            <Radio.Button value={UserType.Dean}>Декан</Radio.Button>
            <Radio.Button value={UserType.Teacher}>Преподаватель</Radio.Button>
            <Radio.Button defaultChecked value={UserType.Student}>
              Студент
            </Radio.Button>
          </Radio.Group>
        </Form.Item>

        <Form.Item
          name="roles"
          label="Роли"
          rules={[
            {
              required: true,
              message: 'Выберите хотя бы одну роль',
            },
          ]}
        >
          <Select
            mode="multiple"
            placeholder="Выберите роль..."
            disabled={loading}
          >
            {(userType === UserType.Teacher || userType === UserType.Dean) && (
              <Select.Option key={UserRole.Admin}>Админ</Select.Option>
            )}
            {(userType === UserType.Teacher || userType === UserType.Dean) && (
              <Select.Option key={UserRole.Teacher}>
                Преподаватель
              </Select.Option>
            )}
            {userType === UserType.Student && (
              <Select.Option key={UserRole.Student}>Студент</Select.Option>
            )}
            {userType === UserType.Student && (
              <Select.Option key={UserRole.GroupHead}>Староста</Select.Option>
            )}
          </Select>
        </Form.Item>

        <div
          style={{ display: 'flex', justifyContent: 'end', paddingTop: '20px' }}
        >
          <Link to={UI_URLS.user.list}>
            <Button type="primary" danger>
              Вернуться к списку
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
