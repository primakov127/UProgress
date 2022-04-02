import { AppShell, testState } from '@ui/app-shell';
import { RecoilRoot, useRecoilValue } from 'recoil';
import { uprogressAppGateway } from '../implementations/uprogressAppGateway';
import 'antd/dist/antd.css';
import { LoginScene } from '../components/LoginScene/LoginScene';
import { ForgotScene } from '../components/ForgotScene/ForgotScene';
import { ResetScene } from '../components/ResetScene/ResetScene';
import { Route, Switch } from 'react-router';
import { UI_URLS } from '../constants';

export const App = () => (
  <RecoilRoot>
    <AppShell appGateway={uprogressAppGateway()}>
      <Switch>
        <Route path={UI_URLS.auth.login} component={LoginScene} />
        <Route path={UI_URLS.auth.forgotPassword} component={ForgotScene} />
        <Route path={UI_URLS.auth.resetPassword} component={ResetScene} />
        <Route path="/">
          <Test />
        </Route>
      </Switch>
    </AppShell>
  </RecoilRoot>
);

const Test = () => {
  const t = useRecoilValue(testState);
  console.log(t);
  return <span>{t?.date}</span>;
};

export default App;
