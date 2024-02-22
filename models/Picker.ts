import mongoose, { Schema } from 'mongoose';

export interface IPicker {
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
    status: boolean;
    score: number;
    employment: {
        startDate: Date;
        endDate: Date;
    };
}

const PickerSchema: Schema = new Schema({
    name: { type: String, required: true, maxlength: 40 },
    phoneNumber: { type: String, required: true, maxlength: 15 },
    emergencyContact: {
        name: { type: String, required: true, maxlength: 40 },
        phoneNumber: { type: String, required: true, maxlength: 15 },
        relationToPicker: { type: String, required: true, maxlength: 10 }
    },
    govId: { type: String, required: true, maxlength: 20 },
    address: { type: String, required: true, maxlength: 50 },
    bloodType: { type: String, required: true, maxlength: 5 },
    status: { type: Boolean, required: true, default: true },
    score: { type: Number, required: true, default: 0 },
    employment: {
        startDate: { type: Date, required: true, default: Date.now },
        endDate: { type: Date, required: true, default: Date.now }
    }
});

const Picker = mongoose.model<IPicker>('Picker', PickerSchema);

export default Picker;
