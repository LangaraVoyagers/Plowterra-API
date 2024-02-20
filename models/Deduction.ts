import { Schema, model } from "mongoose";
import { IDeduction } from "../interfaces/deduction.interface";

const Deduction = model<IDeduction>(
  "Deduction",
  new Schema({
    name: { type: String, required: true },
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

export default Deduction;
