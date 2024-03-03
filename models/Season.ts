import { Schema, model } from "mongoose";
import {
  ISeasonDeductionSchema,
  ISeasonSchema,
} from "../interfaces/season.interface";
import { AuditSchema } from "./Audit";

enum PayrollTimeframeEnum {
  WEEKLY = "Weekly",
  BIWEEKLY = "Bi-Weekly",
  MONTHLY = "Monthly",
}
enum StatusEnum {
  ACTIVE = "Active",
  CLOSED = "Closed",
}

const SeasonSchema = model<ISeasonSchema>(
  "Season",
  new Schema<ISeasonSchema>({
    name: { type: String, required: true },
    startDate: { type: Number, required: true },
    endDate: { type: Number, required: false },
    payrollTimeframe: {
      type: String,
      enum: Object.keys(PayrollTimeframeEnum),
      required: true,
      default: "BIWEEKLY",
    },
    price: { type: Number, required: true },
    status: {
      type: String,
      enum: Object.keys(StatusEnum),
      required: true,
      default: "ACTIVE",
    },
    product: {
      type: Schema.Types.ObjectId,
      ref: "Product",
    },
    //unitID
    //currencyID
    hasHarvestLog: { type: Boolean, default: false },
    deductions: [
      new Schema<ISeasonDeductionSchema>({
        deductionID: {
          type: Schema.Types.ObjectId,
          ref: "Deduction",
        },
        price: {
          type: Number,
          min: 0.01,
          required: function () {
            return !!this.deductionID;
          },
        },
      }),
    ],
    ...AuditSchema,
  })
);

export default SeasonSchema;
export { PayrollTimeframeEnum, StatusEnum };
