import { useEffectAsync } from '@ui/app-shell';
import { Card, Collapse, Progress, Spin, Tag } from 'antd';
import { useState } from 'react';
import { Link } from 'react-router-dom';
import styled from 'styled-components';
import { UI_URLS } from '../../constants';
import { MyDisciplinesItem } from '../../models/MyDisciplinesItem';
import { disciplineService } from '../../services/disciplineService';
import { getType } from '../../utils/stringUtils';

export const MyDisciplinesScene = () => {
  const [myDisciplines, setMyDisciplines] = useState<MyDisciplinesItem[]>();
  const [isLoading, setIsLoading] = useState(false);

  useEffectAsync(async () => {
    setIsLoading(true);

    const result = await disciplineService.getMyDisciplines();
    if (result.isSuccessful) {
      setMyDisciplines(result.list);
    }

    setIsLoading(false);
  }, []);

  return isLoading ? (
    <Spin spinning size="large" />
  ) : (
    <Container>
      <h1>Мои дисциплины:</h1>
      <CardContainer>
        {myDisciplines
          ?.filter((d) => !d.finalMark)
          .map((d) => (
            <Link to={UI_URLS.discipline.view.url(d.id)} className="card">
              <Card
                title={d.name}
                size="small"
                style={{ width: '300px' }}
                hoverable
              >
                <Tag color="magenta">{`${d.semester} семестр`}</Tag>
                <Tag color="gold">{getType(d.type)}</Tag>
                <Progress size="small" percent={d.progress} />
              </Card>
            </Link>
          ))}
      </CardContainer>
      <Collapse ghost>
        <Collapse.Panel key="finished" header={<h2>Завершенные дисциплины</h2>}>
          <CardContainer>
            {myDisciplines
              ?.filter((d) => d.finalMark)
              .map((d) => (
                <Link to={UI_URLS.discipline.view.url(d.id)} className="card">
                  <Card
                    title={
                      <span>
                        {d.name}{' '}
                        <span style={{ float: 'right' }}>{d.finalMark}</span>
                      </span>
                    }
                    size="small"
                    style={{ width: '300px' }}
                    hoverable
                  >
                    <Tag color="magenta">{`${d.semester} семестр`}</Tag>
                    <Tag color="gold">{getType(d.type)}</Tag>
                    <Progress size="small" percent={d.progress} />
                  </Card>
                </Link>
              ))}
          </CardContainer>
        </Collapse.Panel>
      </Collapse>
    </Container>
  );
};

const Container = styled.div`
  .ant-collapse-content-box {
    padding: 0;
  }

  .ant-collapse-header {
    padding: 40px 0 0 !important;
  }

  .ant-collapse-arrow {
    margin-top: 10px;
  }
`;

const CardContainer = styled.div`
  display: flex;
  flex-wrap: wrap;

  .card {
    margin: 0 20px 20px 0;
  }
`;
