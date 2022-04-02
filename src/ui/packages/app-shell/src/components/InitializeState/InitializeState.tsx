import { Spin } from 'antd';
import { useRecoilState, useSetRecoilState } from 'recoil';
import { useEffectAsync } from '../../hooks/useEffectAsync';
import { IAppGateway } from '../../interfaces/IAppGatewat';
import { appGatewayLoadingState } from '../../state/loadingState';
import { testState } from '../../state/testState';
// import { userState } from '../../state/userState';

type Props = {
  appGateway: IAppGateway;
};

export const InitializeState = ({ appGateway }: Props) => {
  //   const setUserState = useSetRecoilState(userState);
  const setTestState = useSetRecoilState(testState);
  const [isPageLoading, setIsPageLoading] = useRecoilState(
    appGatewayLoadingState
  );

  useEffectAsync(async () => {
    setIsPageLoading(true);

    // const user = await appGateway.getUserAsync();
    // setUserState(user);
    const test = await appGateway.getTestAsync();
    setTestState(test);

    setIsPageLoading(false);
  }, []);

  return isPageLoading ? <Spin spinning size="large" /> : null;
};
