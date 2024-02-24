import { IAudit } from "./shared.interface";
import { PayrollTimeframeEnum, StatusEnum } from "../models/Season";
import { Schema } from "mongoose";

export interface ISeason extends IAudit {
  name: string;
  startDate: number;
  endDate: number;
  payrollTimeframe: keyof typeof PayrollTimeframeEnum;
  price: number;
  status: keyof typeof StatusEnum;
  hasHarvestLog: boolean;
  //productID
  //unitID
  //currencyID
  deductions: Array<ISeasonDeduction>;
}

export interface ISeasonDeduction {
  deductionID: Schema.Types.ObjectId;
  price: number;
}
