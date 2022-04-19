import {
  useEffectAsync,
  useLoading,
  User,
  useRole,
  UserRole,
  UserType,
} from '@ui/app-shell';
import { Button, Form, Input, notification, Radio, Select } from 'antd';
import axios from 'axios';
import { useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import styled from 'styled-components';
import { UI_URLS } from '../../constants';
import { userService } from '../../services/userService';

export const ViewUserScene = () => {
  const [form] = Form.useForm();
  const { userId } = useParams<{ userId: string }>();
  const [user, setUser] = useState<User>();
  const { loading, loadingHandler } = useLoading();
  const [userType, setUserType] = useState<UserType>();
  const { isAdmin } = useRole();

  useEffectAsync(async () => {
    const result = await userService.getUser({ userId: userId });
    if (result.isSuccessful) {
      setUser(result);
      setUserType(result.userType);
    }
  }, [userId]);

  const handleUpdate = loadingHandler(async () => {
    try {
      const values = await form.validateFields();
      const result = await userService.updateUser({
        id: userId,
        fullName: values.fullName,
        username: values.username,
        email: values.email,
        phone: values.phone,
        password: values.password,
        userRoles: values.roles,
      });

      if (result.isSuccessful) {
        notification.success({ message: 'Пользователь изменен' });
        const result = await userService.getUser({ userId: userId });
        if (result.isSuccessful) {
          setUser(result);
        }
      }
    } catch (e: unknown) {
      if (!axios.isAxiosError(e)) {
        notification.error({ message: 'Проверьте форму' });
      }
    }
  });

  return (
    <Container>
      {user && (
        <Form
          form={form}
          onSubmitCapture={handleUpdate}
          initialValues={{
            fullName: user.fullName,
            username: user.username,
            phone: user.phone,
            email: user.email,
            userType: user.userType,
            roles: user.userRoles,
          }}
          labelCol={{ span: 2 }}
        >
          <Form.Item
            name="fullName"
            label="ФИО"
            rules={[{ required: true, message: 'Введите ФИО' }]}
          >
            <Input
              disabled={loading || !isAdmin}
              placeholder="Иванов Иван Иванович"
            />
          </Form.Item>

          {isAdmin && (
            <Form.Item
              name="username"
              label="Username"
              rules={[{ required: true, message: 'Введите Username' }]}
            >
              <Input disabled={loading || !isAdmin} placeholder="user12345" />
            </Form.Item>
          )}

          <Form.Item name="phone" label="Номер телефона">
            <Input disabled={loading || !isAdmin} placeholder="+375447843293" />
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
            <Input
              disabled={loading || !isAdmin}
              placeholder="example@gmail.com"
            />
          </Form.Item>

          {isAdmin && (
            <Form.Item
              name="password"
              label="Пароль"
              rules={[{ min: 3, message: 'Минимальная длина 3' }]}
            >
              <Input disabled={loading || !isAdmin} placeholder="pa$$w0rD" />
            </Form.Item>
          )}

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
              disabled
              onChange={(e) => setUserType(e.target.value)}
            >
              <Radio.Button value={UserType.Dean}>Декан</Radio.Button>
              <Radio.Button value={UserType.Teacher}>
                Преподаватель
              </Radio.Button>
              <Radio.Button defaultChecked value={UserType.Student}>
                Студент
              </Radio.Button>
            </Radio.Group>
          </Form.Item>

          {isAdmin && (
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
                disabled={loading || !isAdmin}
              >
                {(userType === UserType.Teacher ||
                  userType === UserType.Dean) && (
                  <Select.Option key={UserRole.Admin}>Админ</Select.Option>
                )}
                {(userType === UserType.Teacher ||
                  userType === UserType.Dean) && (
                  <Select.Option key={UserRole.Teacher}>
                    Преподаватель
                  </Select.Option>
                )}
                {userType === UserType.Student && (
                  <Select.Option key={UserRole.Student}>Студент</Select.Option>
                )}
                {userType === UserType.Student && (
                  <Select.Option key={UserRole.GroupHead}>
                    Староста
                  </Select.Option>
                )}
              </Select>
            </Form.Item>
          )}

          {isAdmin && (
            <div
              style={{
                display: 'flex',
                justifyContent: 'end',
                paddingTop: '20px',
              }}
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
                Сохранить
              </Button>
            </div>
          )}
        </Form>
      )}
    </Container>
  );
};

const Container = styled.div``;
