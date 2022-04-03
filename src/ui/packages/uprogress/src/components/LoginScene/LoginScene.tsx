import { Button, Col, Form, Input, notification, Row } from 'antd';
import { UserOutlined, LockOutlined } from '@ant-design/icons';
import styled from 'styled-components';
import { Link } from 'react-router-dom';
import { UI_URLS } from '../../constants';
import { useLoading } from '@ui/app-shell';
import { authService } from '../../services/authService';
import axios from 'axios';
import { localRedirect } from '../../utils/urlUtils';

export const LoginScene = () => {
  const [form] = Form.useForm();
  const { loading, loadingHandler } = useLoading();

  const handleLogin = loadingHandler(async () => {
    try {
      const values = await form.validateFields();
      const username = values.username;
      const password = values.password;
      console.log('xxx');

      const result = await authService.login({
        usernameOrEmail: username,
        password: password,
      });

      if (result.isSuccessful) {
        localRedirect(UI_URLS.home);
      }

    } catch (e: unknown) {
      if (!axios.isAxiosError(e)) {
        notification.error({ message: 'Проверьте логин и пароль' });
      }
    }
  });

  return (
    <Container>
      <Row>
        <Col className="bg" xs={0} sm={0} md={0} lg={11}>
          sm
        </Col>
        <Col xs={24} sm={24} md={24} lg={13}>
          <Row className="formWrapper">
            <Form form={form} onSubmitCapture={handleLogin} size="large">
              <h1>Авторизация</h1>
              <Form.Item
                name="username"
                rules={[{ required: true, message: 'Введите логин или email' }]}
              >
                <Input
                  disabled={loading}
                  placeholder="логин или email"
                  prefix={<UserOutlined />}
                />
              </Form.Item>

              <Form.Item
                name="password"
                rules={[
                  { required: true, message: 'Введите пароль' },
                  { min: 3, message: 'Минимальная длина пароля: 3' },
                ]}
              >
                <Input.Password
                  disabled={loading}
                  placeholder="пароль"
                  prefix={<LockOutlined />}
                />
              </Form.Item>

              <Button block type="primary" htmlType="submit" loading={loading}>
                Войти
              </Button>

              <Row justify="center">
                <Link to={UI_URLS.auth.forgotPassword}>Забыли пароль?</Link>
              </Row>
            </Form>
          </Row>
        </Col>
      </Row>
    </Container>
  );
};

const Container = styled.div`
  & .bg {
    height: 100vh;
    background: blue;
  }

  & .formWrapper {
    height: 100vh;
    justify-content: center;
    align-items: center;

    h1 {
      text-align: center;
    }
  }
`;
