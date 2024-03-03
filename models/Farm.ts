import { Schema, model } from "mongoose";

import { IFarmSchema } from "../interfaces/farm.interface";

const Farm = model<IFarmSchema>(
  "Farm",
  new Schema({
    name: { type: String, required: true },
    address: { type: String, required: true },
    userIds: { type: [String], required: true },
  })
);

export default Farm;
