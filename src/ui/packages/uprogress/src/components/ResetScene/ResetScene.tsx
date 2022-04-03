import { LockOutlined } from '@ant-design/icons';
import { useLoading } from '@ui/app-shell';
import { Button, Col, Form, Input, notification, Row } from 'antd';
import axios from 'axios';
import { Link, useHistory } from 'react-router-dom';
import styled from 'styled-components';
import { UI_URLS } from '../../constants';
import { useQuery } from '../../hooks/useQuery';
import { authService } from '../../services/authService';

export const ResetScene = () => {
  const [form] = Form.useForm();
  const query = useQuery();
  const history = useHistory();
  const { loading, loadingHandler } = useLoading();

  const handleForgot = loadingHandler(async () => {
    try {
      const values = await form.validateFields();
      const newPassword = values.password;
      const email = query.get('email');
      const token = query.get('token');
      const isPasswordEqual = newPassword === values.repetedpassword;
      if (!isPasswordEqual) {
        notification.error({
          message: 'Пароли не совподают',
        });
        return;
      }

      if (!token && !email) {
        notification.error({ message: 'Чувак, что-то тут не чисто' });
        return;
      }

      const result = await authService.reset({
        email: email as string,
        resetToken: token as string,
        newPassword: newPassword,
      });

      if (result.isSuccessful) {
        notification.success({ message: 'Пароль успешно изменен' });
        history.push(UI_URLS.auth.login);
      }
    } catch (e: unknown) {
      if (!axios.isAxiosError(e)) {
        notification.error({ message: 'Проверьте введенные пароли' });
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
              <h1>Восстановление пароля</h1>
              <Form.Item
                name="password"
                rules={[
                  { required: true, message: 'Введите пароль' },
                  { min: 3, message: 'Минимальная длина пароля: 3' },
                ]}
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
