import { LockOutlined } from '@ant-design/icons';
import { useLoading } from '@ui/app-shell';
import { Button, Col, Form, Input, notification, Row } from 'antd';
import { Link } from 'react-router-dom';
import styled from 'styled-components';
import { UI_URLS } from '../../constants';

export const ForgotScene = () => {
  const [form] = Form.useForm();
  const { loading, loadingHandler } = useLoading();

  const handleForgot = loadingHandler(async () => {
    const values = await form.validateFields();
    const isPasswordEqual = values.password === values.repetedpassword;
    if (!isPasswordEqual) {
      notification.error({
        message: 'Пароли не совподают',
      });
      return;
    }

    notification.success({
      message: 'Вы успешно вошли',
    });
  });

  return (
    <Container>
      <Row>
        <Col className="bg" xs={0} sm={0} md={0} lg={11}>
          sm
        </Col>
        <Col xs={24} sm={24} md={24} lg={13}>
          <Row className="formWrapper">
            <Form form={form} onSubmitCapture={handleForgot} size="large">
              <h1>Восстановление пароля</h1>
              <Form.Item
                name="password"
                rules={[{ required: true, message: 'Введите пароль' }]}
              >
                <Input.Password
                  placeholder="новый пароль"
                  prefix={<LockOutlined />}
                />
              </Form.Item>

              <Form.Item
                name="repetedpassword"
                rules={[{ required: true, message: 'Повторите пароль' }]}
              >
                <Input.Password
                  placeholder="повторите пароль"
                  prefix={<LockOutlined />}
                />
              </Form.Item>

              <Button block type="primary" htmlType="submit" loading={loading}>
                Восстановить
              </Button>

              <Row justify="center">
                <Link to={UI_URLS.auth.login}>Вспомнили пароль?</Link>
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
