import { Menu } from 'antd';
import {
  ContactsOutlined,
  ContainerOutlined,
  FileSearchOutlined,
} from '@ant-design/icons';
import { useRole, useUserType } from '@ui/app-shell';
import { UserTypeIcon } from '../UserTypeIcon/UserTypeIcon';
import { Link, useHistory, useRouteMatch } from 'react-router-dom';
import { COOKIES, UI_URLS } from '../../constants';
import { deleteCookie } from '../../utils/cookieUtils';

export const Header = () => {
  const history = useHistory();
  const userType = useUserType();
  const isAuthPage = useRouteMatch('/auth/*');
  const { isAdmin, isTeacher, isStudent } = useRole();

  const handleLogout = () => {
    deleteCookie(COOKIES.authCookie);
    history.push(UI_URLS.auth.login);
  };

  return userType !== undefined && !isAuthPage ? (
    <Menu mode="horizontal" selectable={false}>
      {isAdmin && (
        <Menu.SubMenu
          key="manage"
          title="Управление"
          icon={<ContactsOutlined />}
        >
          <Menu.Item key={UI_URLS.user.list}>
            <Link to={UI_URLS.user.list}>Управление пользователями</Link>
          </Menu.Item>
        </Menu.SubMenu>
      )}

      <Menu.SubMenu
        key="teach"
        title="Учебный процесс"
        icon={<ContainerOutlined />}
      >
        {isTeacher && (
          <Menu.Item key={UI_URLS.teacher.my}>
            <Link to={UI_URLS.teacher.my}>Мои группы</Link>
          </Menu.Item>
        )}
        {isTeacher && (
          <Menu.Item key={UI_URLS.group.list}>
            <Link to={UI_URLS.group.list}>Группы</Link>
          </Menu.Item>
        )}
        {isTeacher && (
          <Menu.Item key={UI_URLS.discipline.list}>
            <Link to={UI_URLS.discipline.list}>Дисциплины</Link>
          </Menu.Item>
        )}
        {isStudent && (
          <Menu.Item key={UI_URLS.discipline.mylist}>
            <Link to={UI_URLS.discipline.mylist}>Мои дисциплины</Link>
          </Menu.Item>
        )}
      </Menu.SubMenu>

      {isTeacher && (
        <Menu.SubMenu key="report" title="Отчеты" icon={<FileSearchOutlined />}>
          <Menu.Item key={UI_URLS.report.groupDiscipline}>
            <Link to={UI_URLS.report.groupDiscipline}>Група/Дисциплина</Link>
          </Menu.Item>
          <Menu.Item key={UI_URLS.report.sessionAccess}>
            <Link to={UI_URLS.report.sessionAccess}>Допуск к сессии</Link>
          </Menu.Item>
          <Menu.Item key={UI_URLS.report.students}>
            <Link to={UI_URLS.report.students}>Выборка студентов</Link>
          </Menu.Item>
        </Menu.SubMenu>
      )}

      <Menu.SubMenu
        key="side"
        style={{ marginLeft: 'auto' }}
        title={<UserTypeIcon userType={userType} noTooltip />}
      >
        <Menu.Item key={UI_URLS.profile}>
          <Link to={UI_URLS.profile}>Профиль</Link>
        </Menu.Item>
        <Menu.Item key="logout" onClick={handleLogout}>
          Выйти
        </Menu.Item>
      </Menu.SubMenu>
    </Menu>
  ) : null;
};
