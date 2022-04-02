import { AppGatewayModel } from '../models/AppGatewayModel';
import { Test } from '../models/Test';
// import { User } from '../models/User';

export type IAppGateway = {
  getAppGatewayModelAsync: () => Promise<AppGatewayModel>;
  // getUserAsync: () => Promise<User>;
  getTestAsync: () => Promise<Test>;
};
