import { Schema, SchemaDefinition, model } from "mongoose";
import { ICurrency } from "../interfaces/currency.interface";
import { AuditSchema } from "./Audit";

const Currency = model<ICurrency>(
  "Currency",
  new Schema({
    name: { type: String, required: true },
    ...AuditSchema,
  })
);

export default Currency;
