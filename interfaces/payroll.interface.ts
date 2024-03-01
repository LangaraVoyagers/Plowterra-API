import { Schema } from "mongoose";
import { IAuditSchema } from "./shared.interface";

export interface IPayrollSchema extends IAuditSchema {
  farm: Schema.Types.ObjectId;
  startDate: number;
  endDate: number;
  pickersCount: number;
  season: IPayrollSeasonSchema;
  totals: {
    grossAmount: number;
    collectedAmount: number;
    deductions: number;
    netAmount: number;
  };
  details: Array<IPayrollDetailSchema>;
}

export interface IPayrollDetailSchema {
  picker: IPayrollPickerSchema;
  grossAmount: number;
  collectedAmount: number;
  deductions: number;
  netAmount: number;
  pickersCount: number;
}

export interface IPayrollPickerSchema {
  id: string;
  name: string;
}

export interface IPayrollSeasonSchema {
  id: string;
  name: string;
  product: string;
  price: string;
  unit: string;
  currency: string;
}

export interface IFarmPayrollSchema {
  farm: Schema.Types.ObjectId;
  season: Schema.Types.ObjectId;
  lastPayroll: Schema.Types.ObjectId;
  nextEstimatedPayrollDate: number;
}
