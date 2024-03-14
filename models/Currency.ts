import { Schema, model } from "mongoose";
import { ICurrencySchema } from "../interfaces/currency.interface";
import { AuditSchema } from "./Audit";

const Currency = model<ICurrencySchema>(
  "Currency",
  new Schema({
    name: { type: String, required: true },
    ...AuditSchema,
  })
);

export default Currency;
