import { useRecoilValue } from 'recoil';
import styled from 'styled-components';
import { IAppGateway } from '../../interfaces/IAppGatewat';
import { appGatewayLoadingState } from '../../state/loadingState';
import { InitializeState } from '../InitializeState/InitializeState';
import { useRouteMatch } from 'react-router-dom';

type Props = {
  children: JSX.Element | JSX.Element[];
  appGateway: IAppGateway;
};

export const AppShell = ({ appGateway, children }: Props) => {
  const isLoading = useRecoilValue(appGatewayLoadingState);
  const isAuthUrl = useRouteMatch('/auth/*');
  const isAuth = isAuthUrl?.isExact;

  return (
    <Container>
      {isAuth ? null : <InitializeState appGateway={appGateway} />}
      {isLoading && !isAuth ? null : children}
    </Container>
  );
};

const Container = styled.div`
  & > .ant-spin {
    position: fixed;
    top: 0;
    right: 0;
    bottom: 0;
    left: 0;
    background: white;
    z-index: 9999;
    line-height: 100vh;
  }
`;
