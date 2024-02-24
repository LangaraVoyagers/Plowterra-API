import mongoose, { Schema } from "mongoose";
import { IAudit } from "../interfaces/shared.interface";
import { AuditSchema } from "./Audit";

export interface IProduct extends IAudit {
  name: string;
}

const ProductSchema: Schema = new Schema({
  name: { type: String, required: true, maxlength: 40 },
  ...AuditSchema,
});

const Product = mongoose.model<IProduct>("Product", ProductSchema);

export default Product;
