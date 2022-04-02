import { SubGroupType } from "./SubGroupType";
import { UserType } from "./UserType";

export type User = {
    id: string;
    username: string;
    email: string;
    phone: string;
    fullName: string;
    userType: UserType;
    groupId?: string;
    subGroupType?: SubGroupType;
}