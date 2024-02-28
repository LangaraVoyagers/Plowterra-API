import { Schema, model } from "mongoose";
import { IUnit } from "../interfaces/unit.interface";
import { AuditSchema } from "./Audit";

const Unit = model<IUnit>(
  "Unit",
  new Schema({
    name: { type: String, required: true },
    ...AuditSchema,
  }
  )
)

export default Unit;
