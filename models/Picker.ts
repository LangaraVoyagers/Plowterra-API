import mongoose, { Schema } from "mongoose";
import {
  BloodType,
  ICreatePickerRequest,
  IPickerContact,
  Relationship,
} from "project-2-types/dist/interface";

import { IAuditSchema } from "../interfaces/shared.interface";
import { AuditSchema } from "./Audit";
import HarvestLog from "./HarvestLog";

export interface IPickerSchema extends IAuditSchema, ICreatePickerRequest {}

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

PickerSchema.methods.populateHasHarvestLog = async function () {
  const picker = this.toJSON();
  const harvestLog = await HarvestLog.findOne({
    picker: this._id,
    deletedAt: null,
  });

  picker.hasHarvestLog = !!harvestLog;
  return picker;
};

const Picker = mongoose.model<IPickerSchema>("Picker", PickerSchema);

export default Picker;
