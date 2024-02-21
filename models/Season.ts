import { Schema, model } from "mongoose";
import { ISeason } from "../interfaces/season.interface";

enum PayrollTimeframeEnum  {
  WEEKLY= "Weekly",
  BIWEEKLY= "Bi-Weekly",
  MONTHLY="Monthly",
};
enum StatusEnum  { ACTIVE= "Active", CLOSED= "Closed" };

const SeasonSchema = model<ISeason>(
  "Season",
  new Schema({
    name: { type: String, required: true },
    startDate: { type: Number, required: true },
    endDate: { type: Number, required: false },
    payrollTimeframe: {
      type: String,
      enum: PayrollTimeframeEnum,
      required: true,
      default: PayrollTimeframeEnum.BIWEEKLY,
    },
    price: { type: Number, required: true },
    status: {
      type: String,
      enum: StatusEnum,
      required: true,
      default: StatusEnum.ACTIVE,
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
export { PayrollTimeframeEnum, StatusEnum };
