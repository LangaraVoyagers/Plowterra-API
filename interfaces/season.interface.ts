import { Schema } from "mongoose";
import { PayrollTimeframeEnum, StatusEnum } from "../models/Season";
import { IAuditSchema } from "./shared.interface";

export interface ISeasonSchema extends IAuditSchema {
  name: string;
  startDate: number;
  endDate: number;
  payrollTimeframe: keyof typeof PayrollTimeframeEnum;
  price: number;
  status: keyof typeof StatusEnum;
  hasHarvestLog: boolean;
  product: Schema.Types.ObjectId;
  //unitID
  //currencyID
  deductions: Array<ISeasonDeductionSchema>;
}

export interface ISeasonDeductionSchema {
  deductionID: Schema.Types.ObjectId;
  price: number;
}
