import mongoose, { Schema, Document } from 'mongoose';

export interface IPicker extends Document {
    name: string;
    phoneNumber: string;
    emergencyPhoneNumber: string;
    relationToPicker: string;
    govId: string;
    address: string;
    bloodType: string;
    status: boolean;
    warningsCount: number;
    score: number;
    createdBy: string;
    createdAt: Date;
    employmentStartDate: Date;
    employmentEndDate: Date;
    updatedBy: string;
    updatedAt: Date;
    deletedBy: string;
    deletedAt: Date;
}

const PickerSchema: Schema = new Schema({
    name: { type: String, required: true, maxlength: 40 },
    phoneNumber: { type: String, required: true, maxlength: 15 },
    emergencyPhoneNumber: { type: String, required: true, maxlength: 15 },
    relationToPicker: { type: String, required: true, maxlength: 10 },
    govId: { type: String, required: true, maxlength: 20 },
    address: { type: String, required: true, maxlength: 50 },
    bloodType: { type: String, required: true, maxlength: 5 },
    status: { type: Boolean, required: true, default: true },
    warningCount: { type: Number, required: true, default: 0 },
    score: { type: Number, required: true, default: 0 },
    createdBy: { type: String, required: true, maxlength: 40 },
    createdAt: { type: Date, required: true, default: Date.now },
    employmentStartDate: { type: Date, required: true, default: Date.now },
    employmentEndDate: { type: Date, required: true, default: Date.now },
    updatedBy: { type: String, required: false, maxlength: 40 },
    updatedAt: { type: Date, required: false, default: null },
    deletedBy: { type: String, required: false, maxlength: 40 },
    deletedAt: { type: Date, required: false, default: null }
});

const Picker = mongoose.model<IPicker>('Picker', PickerSchema);

export default Picker;
