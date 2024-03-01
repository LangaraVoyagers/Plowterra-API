import mongoose, { Schema } from "mongoose";
import { IAuditSchema } from "../interfaces/shared.interface";
import { AuditSchema } from "./Audit";
import { IProductSchema } from "../interfaces/product.interface";

const ProductSchema: Schema = new Schema({
  name: { type: String, required: true, maxlength: 40 },
  ...AuditSchema,
});

const Product = mongoose.model<IProductSchema>("Product", ProductSchema);

export default Product;
