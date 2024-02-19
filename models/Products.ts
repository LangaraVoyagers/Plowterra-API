import mongoose, { Schema, Document } from 'mongoose';

export interface IProduct extends Document {
    name: string;
    createdBy: string;
    createdAt: Date;
    deletedBy: string;
    deletedAt: Date;
}

const ProductSchema: Schema = new Schema({
    name: { type: String, required: true, maxlength: 40 },
    createdBy: { type: String, required: true, maxlength: 40 },
    createdAt: { type: Date, required: true, default: Date.now },
    deletedBy: { type: String, required: false, maxlength: 40 },
    deletedAt: { type: Date, required: false, default: null }
});

const Product = mongoose.model<IProduct>('Product', ProductSchema);

export default Product;
