import { Schema, model } from "mongoose";
import { ISeason } from "../interfaces/season.interface";
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

const SeasonSchema = model<ISeason>(
  "Season",
  new Schema({
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
    //productID
    //unitID
    //currencyID
    hasHarvestLog: { type: Boolean, default: false },
    ...AuditSchema,
  })
);

export default SeasonSchema;
export { PayrollTimeframeEnum, StatusEnum };
