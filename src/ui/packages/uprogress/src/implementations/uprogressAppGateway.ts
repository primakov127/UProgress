import { AppGatewayModel, IAppGateway, Test } from '@ui/app-shell';
import { API_URLS } from '../constants';
import { getHttpClient } from '../utils/httpUtils';

export const uprogressAppGateway = (): IAppGateway => {
  const getTestAsync = async () => {
    const result = await getHttpClient().get(API_URLS.test.getWeather);

    return result.data[0] as Test;
  };

  const getAppGatewayModelAsync = async () => {
    const test = await getTestAsync();

    return {
      test,
    } as AppGatewayModel;
  };

  return {
    getAppGatewayModelAsync,
    getTestAsync,
  };
};
