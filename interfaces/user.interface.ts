export interface IUserSchema {
  id?: string;
  name: string;
  email: string;
  password: string;
  farm: string;
  token?: string;
  isDisabled?: boolean;
}
