import { useParams } from 'react-router-dom';

export const ViewTaskScene = () => {
  const { disciplineId, taskId } = useParams<{
    disciplineId: string;
    taskId: string;
  }>();

  return <h1>{`DisciplineId: ${disciplineId}, TaskId: ${taskId}`}</h1>;
};
