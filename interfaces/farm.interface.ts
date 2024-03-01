import { Schema } from "mongoose";

export interface IFarmSchema {
  id?: string;
  name: string;
  address: string;
  users: Array<Schema.Types.ObjectId>;
  isDisabled?: boolean;
}
