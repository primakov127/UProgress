import { AppGatewayModel, IAppGateway, User } from '@ui/app-shell';
import { userService } from '../services/userService';

export const uprogressAppGateway = (): IAppGateway => {
  const getUserAsync = async () => {
    const result = await userService.getCurrentUser();

    return result as User;
  };

  const getAppGatewayModelAsync = async () => {
    const user = await getUserAsync();

    return {
      user,
    } as AppGatewayModel;
  };

  return {
    getAppGatewayModelAsync,
    getUserAsync,
  };
};
