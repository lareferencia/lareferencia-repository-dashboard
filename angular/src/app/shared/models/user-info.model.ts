import { PositionType } from './../enums/user-position';
export interface UserInfo {
  username: string;
  first_name: string;
  last_name: string;
  email: string;
  telephone: string;
  password: string;
  position: PositionType;
  affiliation: string;
}
