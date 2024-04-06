import mongoose, { Schema } from "mongoose";
import { IProductSchema } from "../interfaces/product.interface";
import { AuditSchema } from "./Audit";

const ProductSchema: Schema = new Schema({
  name: { type: String, required: true, maxlength: 40 },
  ...AuditSchema,
});

const Product = mongoose.model<IProductSchema>("Product", ProductSchema);

export default Product;
