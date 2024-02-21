import mongoose, { Schema } from "mongoose";
import { IAudit } from "../interfaces/shared.interface";

export interface IProduct extends IAudit {
  name: string;
}

const ProductSchema: Schema = new Schema({
  name: { type: String, required: true, maxlength: 40 },
  createdAt: {
    type: Number,
    default: new Date().getTime(),
  },
  createdBy: {
    //createdBy -> from the token
    type: String,
    default: "",
  }
});

const Product = mongoose.model<IProduct>("Product", ProductSchema);

export default Product;
