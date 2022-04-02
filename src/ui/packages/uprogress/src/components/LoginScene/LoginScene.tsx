import { Button, Col, Form, Input, notification, Row } from 'antd';
import { UserOutlined, LockOutlined } from '@ant-design/icons';
import styled from 'styled-components';
import { Link } from 'react-router-dom';
import { UI_URLS } from '../../constants';

export const LoginScene = () => {
  const [form] = Form.useForm();

  const handleLogin = () => {
    form.validateFields();
    notification.success({
      message: 'Вы успешно вошли',
    });
  };

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
                  placeholder="логин или email"
                  prefix={<UserOutlined />}
                />
              </Form.Item>

              <Form.Item
                name="password"
                rules={[{ required: true, message: 'Введите пароль' }]}
              >
                <Input.Password
                  placeholder="пароль"
                  prefix={<LockOutlined />}
                />
              </Form.Item>

              <Button block type="primary" htmlType="submit">
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
