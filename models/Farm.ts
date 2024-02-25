import { Schema, model } from "mongoose";

import { IFarm } from "../interfaces/farm.interface";

const Farm = model<IFarm>(
  "Farm",
  new Schema({
    name: { type: String, required: true },
    address: { type: String, required: true },
    userIds: { type: [String], required: true }
  }, { versionKey: false })
);

export default Farm;
