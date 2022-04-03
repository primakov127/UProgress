import { MailOutlined } from '@ant-design/icons';
import { useLoading } from '@ui/app-shell';
import { Button, Col, Form, Input, notification, Row } from 'antd';
import axios from 'axios';
import { Link, useHistory } from 'react-router-dom';
import styled from 'styled-components';
import { UI_URLS } from '../../constants';
import { authService } from '../../services/authService';

export const ForgotScene = () => {
  const [form] = Form.useForm();
  const history = useHistory();
  const { loading, loadingHandler } = useLoading();

  const handleForgot = loadingHandler(async () => {
    try {
      const values = await form.validateFields();
      const email = values.email;

      const result = await authService.requestReset({
        email: email,
      });

      if (result.isSuccessful) {
        notification.success({ message: 'Письму выслано на почту' });
        history.push(UI_URLS.auth.login);
      }
    } catch (e: unknown) {
      if (!axios.isAxiosError(e)) {
        notification.error({ message: 'Проверьте почту' });
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
            <Form form={form} onSubmitCapture={handleForgot} size="large">
              <h1>Забыли пароль?</h1>
              <Form.Item
                name="email"
                rules={[
                  {
                    required: true,
                    type: 'email',
                    message: 'Введите корректный email',
                  },
                ]}
              >
                <Input
                  disabled={loading}
                  placeholder="ваш email"
                  prefix={<MailOutlined />}
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
