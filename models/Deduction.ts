import { Schema, SchemaDefinition, model } from "mongoose";
import { IDeduction } from "../interfaces/deduction.interface";
import { AuditSchema } from "./Audit";

const Deduction = model<IDeduction>(
  "Deduction",
  new Schema({
    name: { type: String, required: true },
    ...AuditSchema,
  })
);

export default Deduction;
