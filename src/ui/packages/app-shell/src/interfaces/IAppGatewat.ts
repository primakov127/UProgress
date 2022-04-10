import { AppGatewayModel } from '../models/AppGatewayModel';
import { User } from '../models/User';

export type IAppGateway = {
  getAppGatewayModelAsync: () => Promise<AppGatewayModel>;
  getUserAsync: () => Promise<User>;
};
