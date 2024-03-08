import mongoose, { Schema } from "mongoose";
import {
  BloodType,
  IPicker,
  IPickerContact,
  Relationship,
} from "project-2-types/lib/pickers";

import { IAuditSchema } from "../interfaces/shared.interface";
import { AuditSchema } from "./Audit";

export interface IPickerSchema extends IAuditSchema, IPicker {
  // TODO: move this to the types package
  harvestLogs: Array<Schema.Types.ObjectId>;
}

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
  harvestLogs: {
    type: [Schema.Types.ObjectId],
    ref: "HarvestLog",
    default: [],
  },
  ...AuditSchema,
});

// 'hasHarvestLog' virtual field
PickerSchema.virtual("hasHarvestLog").get(function () {
  const harvestLogs = this.harvestLogs as Array<Schema.Types.ObjectId>;
  return !!harvestLogs.length;
});

// populate virtual fields when converting to JSON
PickerSchema.set("toJSON", { virtuals: true });

const Picker = mongoose.model<IPickerSchema>("Picker", PickerSchema);

export default Picker;
