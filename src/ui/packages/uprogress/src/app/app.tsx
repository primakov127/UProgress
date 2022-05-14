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
import { Header } from '../components/Header/Header';
import styled from 'styled-components';
import { MyDisciplinesScene } from '../components/MyDisciplinesScene/MyDisciplinesScene';
import { Home } from '../components/Home/Home';
import { TeacherAssignScene } from '../components/TeacherAssignScene/TeacherAssignScene';
import { GroupDisciplineScene } from '../components/GroupDisciplineScene/GroupDisciplineScene';
import { GroupDisciplineReportScene } from '../components/GroupDisciplineReportScene/GroupDisciplineReportScene';
import { GroupSessionAccessReportScene } from '../components/GroupSessionAccessReportScene/GroupSessionAccessReportScene';
import { ChangeFinalMarkScene } from '../components/ChangeFinalMarkScene/ChangeFinalMarkScene';
import { ViewGroupScene } from '../components/ViewGroupScene/ViewGroupScene';
import { Profile } from '../components/Profile/Profile';
import { StudentsReportScene } from '../components/StudentsReportScene/StudentsReportScene';
import { MyProgress } from '../components/MyProgress/MyProgress';
import { StudentProgressReportScene } from '../components/StudentProgressReportScene/StudentProgressReportScene';

export const App = () => (
  <RecoilRoot>
    <AppShell appGateway={uprogressAppGateway()}>
      <Header />
      <MainContainer>
        <Switch>
          <Route exact path={UI_URLS.home} component={Home} />
          <Route exact path={UI_URLS.profile} component={Profile} />
          <Route exact path={UI_URLS.myProgress} component={MyProgress} />

          <Route path={UI_URLS.auth.login} component={LoginScene} />
          <Route path={UI_URLS.auth.forgotPassword} component={ForgotScene} />
          <Route path={UI_URLS.auth.resetPassword} component={ResetScene} />

          <Route path={UI_URLS.user.add} component={AddUserScene} />
          <Route path={UI_URLS.user.list} component={UserListScene} />
          <Route path={UI_URLS.user.view.template} component={ViewUserScene} />

          <Route path={UI_URLS.group.list} component={GroupListScene} />
          <Route path={UI_URLS.group.add} component={AddGroupScene} />
          <Route
            path={UI_URLS.group.view.template}
            component={ViewGroupScene}
          />

          <Route
            path={UI_URLS.discipline.list}
            component={DisciplineListScene}
          />
          <Route
            path={UI_URLS.discipline.mylist}
            component={MyDisciplinesScene}
          />
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

          <Route path={UI_URLS.teacher.my} component={TeacherAssignScene} />
          <Route
            path={UI_URLS.teacher.group.template}
            component={GroupDisciplineScene}
          />
          <Route
            path={UI_URLS.teacher.changeFinalMark.template}
            component={ChangeFinalMarkScene}
          />

          <Route
            path={UI_URLS.report.groupDiscipline}
            component={GroupDisciplineReportScene}
          />
          <Route
            path={UI_URLS.report.sessionAccess}
            component={GroupSessionAccessReportScene}
          />
          <Route
            path={UI_URLS.report.students}
            component={StudentsReportScene}
          />
          <Route
            path={UI_URLS.report.studentProgress}
            component={StudentProgressReportScene}
          />
        </Switch>
      </MainContainer>
    </AppShell>
  </RecoilRoot>
);

const MainContainer = styled.div`
  padding: 30px 200px;
`;

export default App;
