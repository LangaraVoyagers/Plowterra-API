export interface IUserSchema {
  id?: string;
  name: string;
  email: string;
  password: string;
  farmId: string; // TODO: Review this field
  token?: string;
  isDisabled?: boolean;
}
