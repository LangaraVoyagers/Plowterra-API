import { Schema } from "mongoose";
import { PayrollTimeframeEnum, StatusEnum } from "../models/Season";
import { IAuditSchema } from "./shared.interface";

export interface ISeasonSchema extends IAuditSchema {
  name: string;
  startDate: number;
  endDate: number;
  farm: Schema.Types.ObjectId;
  payrollTimeframe: keyof typeof PayrollTimeframeEnum;
  price: number;
  status: keyof typeof StatusEnum;
  hasHarvestLog: boolean;
  product: Schema.Types.ObjectId;
  unit: Schema.Types.ObjectId;
  currency: Schema.Types.ObjectId;
  deductions: Array<ISeasonDeductionSchema>;
}

export interface ISeasonDeductionSchema {
  deductionID: String;
  price: number;
}
