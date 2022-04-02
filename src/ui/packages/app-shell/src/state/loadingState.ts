import { atom } from 'recoil';

const keyPrefix = 'loadingState/';

const KEYS = {
  appGateway: `${keyPrefix}appGateway`,
};

export const appGatewayLoadingState = atom<boolean>({
  key: KEYS.appGateway,
  default: true,
});
