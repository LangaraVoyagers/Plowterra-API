import { Schema } from "mongoose";
import { IAuditSchema } from "./shared.interface";

export interface IHarvestLogSchema extends IAuditSchema {
  id?: string;
  season: Schema.Types.ObjectId;
  picker: Schema.Types.ObjectId;
  collectedAmount: number;
  seasonDeductions: Array<Schema.Types.ObjectId>;
  totalDeduction?: number;
  correctionLogs: Array<Schema.Types.ObjectId>;
  parentId: Schema.Types.ObjectId;
  notes?: string;
  settled?: boolean;
}
