import { Schema, model } from "mongoose";
import { IPayroll, IPayrollDetail } from "../interfaces/payroll.interface";
import { AuditSchema } from "./Audit";

// TODO: Review picker schema when it's ready
const PickerSchema = new Schema<{ name: string }>({
  name: { type: String, required: true },
});

const DetailSchema = new Schema<IPayrollDetail>({
  picker: PickerSchema,
  collectedAmount: { type: Number, required: true },
  deductions: { type: Number, required: true },
  grossAmount: { type: Number, required: true },
  netAmount: { type: Number, required: true },
  pickersCount: { type: Number, required: true },
});

const Payroll = model<IPayroll>(
  "Payroll",
  new Schema({
    startDate: { type: Number, required: true },
    endDate: { type: Number, required: true },
    pickersCount: { type: Number, required: true },
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

export default Payroll;
