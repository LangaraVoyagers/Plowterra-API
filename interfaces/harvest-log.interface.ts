import { IAuditSchema } from "./shared.interface";
import { Schema } from "mongoose";

export interface IHarvestLogSchema extends IAuditSchema {
  id?: string;
  season: Schema.Types.ObjectId;
  picker: Schema.Types.ObjectId;
  collectedAmount: number;
  seasonDeductions: Array<Schema.Types.ObjectId>;
  totalDeduction?: number;
  notes?: string;
  settled?: boolean;
}

