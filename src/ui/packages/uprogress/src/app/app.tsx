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

export const App = () => (
  <RecoilRoot>
    <AppShell appGateway={uprogressAppGateway()}>
      <Switch>
        <Route path={UI_URLS.auth.login} component={LoginScene} />
        <Route path={UI_URLS.auth.forgotPassword} component={ForgotScene} />
        <Route path={UI_URLS.auth.resetPassword} component={ResetScene} />

        <Route path={UI_URLS.home} component={UserListScene} />
      </Switch>
    </AppShell>
  </RecoilRoot>
);

export default App;
