import { UserGroupAction } from '../enums/user-group-action';

export interface UserGroup {
  action: UserGroupAction;
  groupname: string;
}
