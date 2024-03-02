import { Schema, model } from "mongoose";

import { IFarmSchema } from "../interfaces/farm.interface";

const Farm = model<IFarmSchema>(
  "Farm",
  new Schema(
    {
      name: { type: String, required: true },
      address: { type: String, default: null },
      users: { type: [Schema.Types.ObjectId], ref: "User", default: [] },
      isDisabled: { type: Boolean, default: false }
    }
  )
);

export default Farm;
