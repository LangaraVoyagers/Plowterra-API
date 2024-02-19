import { Schema, model } from "mongoose";
import { ISeason } from "../interfaces/season.interface";

const SeasonSchema = model<ISeason>(
  "Season",
  new Schema({
    name: { type: String, required: true },
    startDate: { type: Number, required: true },
    endDate: { type: Number, required: true },
    payroll_timeframe: { type: String, required: true },
    price: { type: Number, required: true },
    status: { type: String, required: true },
  })
);

export default SeasonSchema;
