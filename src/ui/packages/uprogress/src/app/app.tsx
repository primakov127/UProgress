import { AppShell, testState } from '@ui/app-shell';
import { RecoilRoot, useRecoilValue } from 'recoil';
import { uprogressAppGateway } from '../implementations/uprogressAppGateway';
import 'antd/dist/antd.css';

export const App = () => (
  <RecoilRoot>
    <AppShell appGateway={uprogressAppGateway()}>
      <h1>Hello World</h1>
      <Test />
    </AppShell>
  </RecoilRoot>
);

const Test = () => {
  const t = useRecoilValue(testState);
  console.log(t);
  return <span>{t?.date}</span>;
};

export default App;
