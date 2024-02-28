import { Schema } from "mongoose";
import { ISeason } from "./season.interface";
import { IPicker } from "project-2-types";
import { IDeduction } from "./deduction.interface";

export interface IHarvestLog {
  id?: string;
  season: Schema.Types.ObjectId;
  picker: Schema.Types.ObjectId;
  collectedAmount: number;
  seasonDeductions: Array<Schema.Types.ObjectId>;
  totalDeduction?: number;
  notes?: string;
}

export interface IHarvestLogResponse {
  id: string;
  season?: ISeason;
  picker?: IPicker;
  collectedAmount: number;
  seasonDeductions?: Array<IDeduction>;
  totalDeduction?: number;
  notes?: string;
}
