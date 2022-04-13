import { AppShell } from '@ui/app-shell';
import { Route, Switch } from 'react-router';
import { RecoilRoot } from 'recoil';
import { uprogressAppGateway } from '../implementations/uprogressAppGateway';
import { LoginScene } from '../components/LoginScene/LoginScene';
import { ForgotScene } from '../components/ForgotScene/ForgotScene';
import { ResetScene } from '../components/ResetScene/ResetScene';
import { UserListScene } from '../components/UserListScene/UserListScene';
import { UI_URLS } from '../constants';
import 'antd/dist/antd.css';
import { AddUserScene } from '../components/AddUserScene/AddUserScene';
import { ViewUserScene } from '../components/ViewUserScene/ViewUserScene';
import { GroupListScene } from '../components/GroupListScene/GroupListScene';
import { AddGroupScene } from '../components/AddGroupScene/AddGroupScene';
import { AddDisciplineScene } from '../components/AddDisciplineScene/AddDisciplineScene';
import { DisciplineListScene } from '../components/DisciplineListScene/DisciplineListScene';
import { AddTaskScene } from '../components/AddTaskScene/AddTaskScene';
import { ViewDisciplineScene } from '../components/ViewDisciplineScene/ViewDisciplineScene';
import { ViewTaskScene } from '../components/ViewTaskScene/ViewTaskScene';
import { AddTaskAnswerScene } from '../components/AddTaskAnswerScene/AddTaskAnswerScene';
import { ViewTaskAnswerScene } from '../components/ViewTaskAnswerScene/ViewTaskAnswerScene';

export const App = () => (
  <RecoilRoot>
    <AppShell appGateway={uprogressAppGateway()}>
      <Switch>
        <Route path={UI_URLS.auth.login} component={LoginScene} />
        <Route path={UI_URLS.auth.forgotPassword} component={ForgotScene} />
        <Route path={UI_URLS.auth.resetPassword} component={ResetScene} />

        <Route path={UI_URLS.user.add} component={AddUserScene} />
        <Route path={UI_URLS.user.list} component={UserListScene} />
        <Route path={UI_URLS.user.view.template} component={ViewUserScene} />

        <Route path={UI_URLS.group.list} component={GroupListScene} />
        <Route path={UI_URLS.group.add} component={AddGroupScene} />

        <Route path={UI_URLS.discipline.list} component={DisciplineListScene} />
        <Route path={UI_URLS.discipline.add} component={AddDisciplineScene} />
        <Route
          path={UI_URLS.discipline.view.template}
          component={ViewDisciplineScene}
        />
        <Route
          path={UI_URLS.discipline.addTask.template}
          component={AddTaskScene}
        />
        <Route
          path={UI_URLS.discipline.viewTask.template}
          component={ViewTaskScene}
        />

        <Route
          path={UI_URLS.taskAnswer.add.template}
          component={AddTaskAnswerScene}
        />
        <Route
          path={UI_URLS.taskAnswer.view.template}
          component={ViewTaskAnswerScene}
        />
      </Switch>
    </AppShell>
  </RecoilRoot>
);

export default App;
