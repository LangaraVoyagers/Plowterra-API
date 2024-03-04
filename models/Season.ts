import { Schema, model } from "mongoose";
import {
  ISeasonDeductionSchema,
  ISeasonSchema,
} from "../interfaces/season.interface";
import seasonMessages from "../messages/season.messages";
import { AuditSchema } from "./Audit";
import Currency from "./Currency";
import Deduction from "./Deduction";
import Farm from "./Farm";
import Product from "./Products";
import Unit from "./Unit";

enum PayrollTimeframeEnum {
  WEEKLY = "Weekly",
  BIWEEKLY = "Bi-Weekly",
  MONTHLY = "Monthly",
}

export enum SeasonStatusEnum {
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
      enum: Object.keys(SeasonStatusEnum),
      required: true,
      default: "ACTIVE",
    },
    farm: {
      type: Schema.Types.ObjectId,
      ref: "Farm",
      required: [true, seasonMessages.INVALID_FARM_ID],
      validate: {
        validator: async (id: string) => {
          const data = await Farm.exists({ _id: id });
          return !!data;
        },
        message: seasonMessages.INVALID_FARM_ID,
      },
    },
    product: {
      type: Schema.Types.ObjectId,
      ref: "Product",
      required: [true, seasonMessages.INVALID_PRODUCT_ID],
      validate: {
        validator: async (id: string) => {
          const data = await Product.exists({ _id: id, deletedAt: null });
          return !!data;
        },
        message: seasonMessages.INVALID_PRODUCT_ID,
      },
    },
    unit: {
      type: Schema.Types.ObjectId,
      ref: "Unit",
      required: [true, seasonMessages.INVALID_UNIT_ID],
      validate: {
        validator: async (id: string) => {
          const data = await Unit.exists({ _id: id, deletedAt: null });
          return !!data;
        },
        message: seasonMessages.INVALID_UNIT_ID,
      },
    },
    currency: {
      type: Schema.Types.ObjectId,
      ref: "Currency",
      required: [true, seasonMessages.INVALID_CURRENCY_ID],
      validate: {
        validator: async (id: string) => {
          const data = await Currency.exists({ _id: id, deletedAt: null });
          return !!data;
        },
        message: seasonMessages.INVALID_CURRENCY_ID,
      },
    },
    hasHarvestLog: { type: Boolean, default: false },
    deductions: [
      new Schema<ISeasonDeductionSchema>({
        deductionID: {
          type: Schema.Types.ObjectId,
          ref: "Deduction",
          validate: {
            validator: async (id: string) => {
              const data = await Deduction.exists({ _id: id, deletedAt: null });

              return !!data;
            },
            message: seasonMessages.INVALID_DEDUCTION_ID,
          },
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
export { PayrollTimeframeEnum, SeasonStatusEnum as StatusEnum };
