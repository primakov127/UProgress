import { MailOutlined } from '@ant-design/icons';
import { Button, Col, Form, Input, notification, Row } from 'antd';
import { Link } from 'react-router-dom';
import styled from 'styled-components';
import { UI_URLS } from '../../constants';

export const ResetScene = () => {
  const [form] = Form.useForm();

  const handleForgot = () => {
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
            <Form form={form} onSubmitCapture={handleForgot} size="large">
              <h1>Забыли пароль?</h1>
              <Form.Item
                name="email"
                rules={[{ required: true, message: 'Введите email' }]}
              >
                <Input placeholder="ваш email" prefix={<MailOutlined />} />
              </Form.Item>

              <Button block type="primary" htmlType="submit">
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
