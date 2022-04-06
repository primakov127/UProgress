import { useParams } from 'react-router-dom';

export const ViewUserScene = () => {
  const { userId } = useParams<{ userId: string }>();

  return <div>UserId: {userId}</div>;
};
