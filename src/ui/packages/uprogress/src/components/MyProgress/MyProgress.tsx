import { useEffectAsync } from '@ui/app-shell';
import { Card, Input, InputNumber, Progress } from 'antd';
import { useState } from 'react';
import styled from 'styled-components';
import { MyDisciplinesItem } from '../../models/MyDisciplinesItem';
import { disciplineService } from '../../services/disciplineService';

export const MyProgress = () => {
  const [myDisciplines, setMyDisciplines] = useState<MyDisciplinesItem[]>();
  const [semester, setSemester] = useState<number>();

  useEffectAsync(async () => {
    const result = await disciplineService.getMyDisciplines();
    if (result.isSuccessful) {
      setMyDisciplines(result.list);
    }
  }, []);

  const getTotalAvgMark = () => {
    let markSum = 0;
    let finishedDisciplineCount = 0;

    myDisciplines?.forEach((d) => {
      if (d.finalMark) {
        finishedDisciplineCount++;
        markSum += d.finalMark;
      }
    });

    return markSum / finishedDisciplineCount;
  };

  const getSemesterAvgMark = (semester: number) => {
    let markSum = 0;
    let finishedDisciplineCount = 0;

    myDisciplines?.forEach((d) => {
      if (d.finalMark && d.semester === semester) {
        finishedDisciplineCount++;
        markSum += d.finalMark;
      }
    });

    return markSum / finishedDisciplineCount;
  };

  const MarkCard = ({
    title,
    description,
    mark,
    hasInput = false,
  }: {
    title: string;
    description: string;
    mark: number;
    hasInput?: boolean;
  }) => (
    <Card
      style={{ width: '200px' }}
      bordered={false}
      cover={
        <Progress
          type="circle"
          percent={mark * 10}
          format={(percent) => (percent ?? 0) / 10}
        />
      }
    >
      <Card.Meta title={title} description={description} />
      {hasInput && (
        <InputNumber
          placeholder="семестр"
          style={{ margin: '0 auto', display: 'block', marginTop: '15px' }}
          value={semester}
          onChange={(e) => setSemester(Number(e))}
        />
      )}
    </Card>
  );

  return (
    <Container>
      <h1>Моя статистика:</h1>
      <div style={{ display: 'flex' }}>
        <MarkCard
          title="Итоговая"
          description="Средня отметка за все семестры"
          mark={getTotalAvgMark()}
        />
        <MarkCard
          title="Итоговая/семестр"
          description="Средня отметка за выбранный семестр"
          mark={getSemesterAvgMark(semester ?? 0)}
          hasInput
        />
      </div>
    </Container>
  );
};

const Container = styled.div`
  width: fit-content;
  margin: 0 auto;

  .ant-progress-inner {
    padding: 15px;
    width: inherit !important;
    height: inherit !important;
  }
`;
