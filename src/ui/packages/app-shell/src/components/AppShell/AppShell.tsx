import { useRecoilValue } from 'recoil';
import styled from 'styled-components';
import { IAppGateway } from '../../interfaces/IAppGatewat';
import { appGatewayLoadingState } from '../../state/loadingState';
import { InitializeState } from '../InitializeState/InitializeState';

type Props = {
  children: JSX.Element | JSX.Element[];
  appGateway: IAppGateway;
};

export const AppShell = ({ appGateway, children }: Props) => {
  const isLoading = useRecoilValue(appGatewayLoadingState);

  return (
    <Container>
      <InitializeState appGateway={appGateway} />
      {isLoading ? null : children}
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
