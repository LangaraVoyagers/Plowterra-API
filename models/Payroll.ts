import { Schema, model } from "mongoose";
import {
  IPayrollSchema,
  IPayrollDetailSchema,
  IPayrollPickerSchema,
  IPayrollSeasonSchema,
  IFarmPayrollSchema,
} from "../interfaces/payroll.interface";
import { AuditSchema } from "./Audit";

const PayrollPickerSchema = new Schema<IPayrollPickerSchema>({
  id: { type: String, required: true },
  name: { type: String, required: true },
});

const PayrollSeasonSchema = new Schema<IPayrollSeasonSchema>({
  id: { type: String, required: true },
  name: { type: String, required: true },
  currency: { type: String, required: true },
  price: { type: String, required: true },
  product: { type: String, required: true },
  unit: { type: String, required: true },
});

const DetailSchema = new Schema<IPayrollDetailSchema>({
  picker: PayrollPickerSchema,
  collectedAmount: { type: Number, required: true },
  deductions: { type: Number, required: true },
  grossAmount: { type: Number, required: true },
  netAmount: { type: Number, required: true },
});

const Payroll = model<IPayrollSchema>(
  "Payroll",
  new Schema({
    farm: { type: Schema.Types.ObjectId, ref: "Farm" },
    startDate: { type: Number, required: true },
    endDate: { type: Number, required: true },
    pickersCount: { type: Number, required: true },
    season: PayrollSeasonSchema,
    totals: {
      netAmount: { type: Number, required: true },
      collectedAmount: { type: Number, required: true },
      grossAmount: { type: Number, required: true },
      deductions: { type: Number, required: true },
    },
    details: [DetailSchema],
    ...AuditSchema,
  })
);

export const FarmPayroll = model<IFarmPayrollSchema>(
  "FarmPayroll",
  new Schema({
    farm: { type: Schema.Types.ObjectId, ref: "Farm" },
    season: { type: Schema.Types.ObjectId, ref: "Season" },
    lastPayroll: { type: Schema.Types.ObjectId, ref: "Payroll" },
    nextEstimatedPayrollDate: { type: Number, required: true },
  })
);


export default Payroll;
