import { useRole } from '@ui/app-shell';
import { Redirect } from 'react-router-dom';
import { UI_URLS } from '../../constants';

export const Home = () => {
  const { isStudent, isTeacher, isAdmin } = useRole();

  if (isStudent) {
    return <Redirect to={UI_URLS.discipline.mylist} />;
  }

  if (isTeacher) {
    return <Redirect to={UI_URLS.teacher.my} />;
  }

  if (isAdmin) {
    return <Redirect to={UI_URLS.user.list} />;
  }

  return null;
};
