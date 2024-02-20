import { Schema, model } from "mongoose";
import { ISeason } from "../interfaces/season.interface";

const PayrollTimeframeEnum = ["Weekly", "Biweekly", "Monthly"];
const StatusEnum = ["Active", "Closed"];

const SeasonSchema = model<ISeason>(
  "Season",
  new Schema({
    name: { type: String, required: true },
    startDate: { type: Number, required: true },
    endDate: { type: Number, required: true },
    payrollTimeframe: {
      type: String,
      enum: PayrollTimeframeEnum,
      required: true,
      default: "Biweekly",
    },
    price: { type: Number, required: true },
    status: {
      type: String,
      enum: StatusEnum,
      required: true,
      default: "Active",
    },
    //productID
    //unitID
    //currencyID
    hasHarvestLog: { type: Boolean, default: false },
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
