import { Schema } from "mongoose";

export interface IFarmSchema {
  name: string;
  address: string;
  userIds: Array<Schema.Types.ObjectId>;
}
