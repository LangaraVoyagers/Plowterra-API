import {
  BloodType,
  IPicker,
  IPickerContact,
  Relationship,
} from "project-2-types/dist/interface";
import mongoose, { Schema } from "mongoose";

import { AuditSchema } from "./Audit";
import { IAuditSchema } from "../interfaces/shared.interface";

export interface IPickerSchema extends IAuditSchema, IPicker {}

const PickerSchema: Schema = new Schema<IPickerSchema>({
  name: { type: String, required: true, maxlength: 40 },
  phone: { type: String, required: true, maxlength: 30 },
  emergencyContact: new Schema<IPickerContact>({
    name: { type: String, required: true, maxlength: 40 },
    phone: { type: String, required: true, maxlength: 30 },
    relationship: {
      type: String,
      enum: Object.keys(Relationship),
      required: true,
    },
  }),
  govId: { type: String, maxlength: 20 },
  address: { type: String, maxlength: 50 },
  bloodType: { type: String, enum: Object.keys(BloodType) },
  score: { type: Number, default: 0 },
  employment: {
    startDate: { type: Number, default: Date.now },
    endDate: { type: Number },
  },
  ...AuditSchema,
});

const Picker = mongoose.model<IPickerSchema>("Picker", PickerSchema);

export default Picker;
