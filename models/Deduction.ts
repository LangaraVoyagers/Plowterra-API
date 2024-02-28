import { Schema, model } from "mongoose";
import { IDeductionSchema } from "../interfaces/deduction.interface";
import { AuditSchema } from "./Audit";

const Deduction = model<IDeductionSchema>(
  "Deduction",
  new Schema({
    name: { type: String, required: true },
    ...AuditSchema,
  })
);

export default Deduction;
