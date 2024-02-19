import { Schema, model } from "mongoose";
import { ISeason } from "../interfaces/season.interface";

const PayrollTimeframeEnum = ["Weekly", "Biweekly", "Monthly"];

const SeasonSchema = model<ISeason>(
  "Season",
  new Schema({
    name: { type: String, required: true },
    startDate: { type: Number, required: true },
    endDate: { type: Number, required: true },
    payroll_timeframe: {
      type: String,
      enum: PayrollTimeframeEnum,
      required: true,
    },
    price: { type: Number, required: true },
    status: { type: String, required: true, default: "Active" },
    //product_id
    //unit_id
    //currency_id
    has_harvest_log: { type: Boolean, default: false },
    createdAt: {
      type: Number,
      default: new Date().getTime(),
    },
    createdBy: {
      //createdBy -> from the token
      type: String,
      default: "",
    },
    updatedAt: {
      type: Number,
      default: null,
    },
    updatedBy: {
      //updatedBy -> from the token
      type: String,
      default: null,
    },
    deletedAt: {
      type: Number,
      default: null,
    },
    deletedBy: {
      //updatedBy -> from the token
      type: String,
      default: null,
    },
  })
);

export default SeasonSchema;
