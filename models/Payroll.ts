import { Schema, model } from "mongoose";
import { IPayroll, IPayrollDetail } from "../interfaces/payroll.interface";

// TODO: Review picker schema when it's ready
const PickerSchema = new Schema<{ name: string }>({
  name: { type: String, required: true },
});

const DetailSchema = new Schema<IPayrollDetail>({
  picker: PickerSchema,
  collected_amount: { type: Number, required: true },
  deductions: { type: Number, required: true },
  gross_amount: { type: Number, required: true },
  net_amount: { type: Number, required: true },
  total_pickers: { type: Number, required: true },
});

const Payroll = model<IPayroll>(
  "Payroll",
  new Schema({
    start_date: { type: Number, required: true },
    end_date: { type: Number, required: true },
    total_pickers: { type: Number, required: true },
    totals: {
      total_paid: { type: Number, required: true },
      total_collected_amount: { type: Number, required: true },
      total_gross_amount: { type: Number, required: true },
      total_deductions: { type: Number, required: true },
    },
    details: [DetailSchema],
  })
);

export default Payroll;
