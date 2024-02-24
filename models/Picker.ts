import mongoose, { Schema } from 'mongoose';
import { IAudit } from "../interfaces/shared.interface";
import { AuditSchema } from "./Audit";

export interface IPicker extends IAudit {
  name: string;
  phoneNumber: string;
  emergencyContact: {
    name: string;
    phoneNumber: string;
    relationToPicker: string;
  };
  govId: string;
  address: string;
  bloodType: string;
  score: number;
  employment: {
    startDate: Date;
    endDate: Date;
  };
}

const PickerSchema: Schema = new Schema(
  {
    name: { type: String, required: true, maxlength: 40 },
    phoneNumber: { type: String, required: true, maxlength: 15 },
    emergencyContact: {
      name: { type: String, required: true, maxlength: 40 },
      phoneNumber: { type: String, required: true, maxlength: 15 },
      relationToPicker: { type: String, required: true, maxlength: 10 },
    },
    govId: { type: String, maxlength: 20 },
    address: { type: String, maxlength: 50 },
    bloodType: { type: String, maxlength: 5 },
    score: { type: Number, default: 0 },
    employment: {
      startDate: { type: Number, default: Date.now },
      endDate: { type: Number },
    },
    ...AuditSchema,
  },
  {
    toJSON: {
      // return the id
      virtuals: true,
    },
  }
);

const Picker = mongoose.model<IPicker>('Picker', PickerSchema);

export default Picker;
