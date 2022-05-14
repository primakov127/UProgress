import { SubGroupType, useEffectAsync } from '@ui/app-shell';
import { Card, Collapse, Spin, Tag } from 'antd';
import { useState } from 'react';
import { Link } from 'react-router-dom';
import styled from 'styled-components';
import { UI_URLS } from '../../constants';
import { MyGroupDisciplinesItem } from '../../models/MyGroupDisciplinesItem';
import { assignService } from '../../services/assignService';
import { getType } from '../../utils/stringUtils';

export const TeacherAssignScene = () => {
  const [groupDisciplines, setGroupDisciplines] =
    useState<MyGroupDisciplinesItem[]>();
  const [isLoading, setIsLoading] = useState(false);

  useEffectAsync(async () => {
    setIsLoading(true);

    const result = await assignService.getMyGroupDisciplines();
    console.log(result);
    if (result.isSuccessful) {
      setGroupDisciplines(result.list);
    }

    setIsLoading(false);
  }, []);

  const getSubGroupType = (type: SubGroupType) => {
    switch (type) {
      case SubGroupType.First:
        return '1-ая подгруппа';
      case SubGroupType.Second:
        return '2-ая подгруппа';
      case SubGroupType.Full:
        return 'вся группа';
      default:
        return '';
    }
  };

  const groups = groupDisciplines?.filter(
    (gd, index, self) =>
      index === self.findIndex((x) => x.groupId === gd.groupId)
  );

  return isLoading ? (
    <Spin spinning size="large" />
  ) : (
    <Container>
      <Collapse ghost>
        {groups?.map((g) => (
          <Collapse.Panel key={g.groupId} header={<h2>{g.groupName}</h2>}>
            <CardContainer>
              {groupDisciplines
                ?.filter((d) => d.groupId === g.groupId)
                .map((d) => (
                  <Link
                    to={UI_URLS.teacher.group.url(
                      d.groupId,
                      d.disciplineId,
                      d.subGroupType
                    )}
                    className="card"
                  >
                    <Card
                      title={d.disciplineName}
                      size="small"
                      style={{ width: '300px' }}
                      hoverable
                    >
                      <Tag color="magenta">{`${d.disciplineSemester} семестр`}</Tag>
                      <Tag color="gold">{getType(d.disciplineType)}</Tag>
                      <Tag color="green">{getSubGroupType(d.subGroupType)}</Tag>
                    </Card>
                  </Link>
                ))}
            </CardContainer>
          </Collapse.Panel>
        ))}
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
