import { Schema, model } from "mongoose";

import { IUserSchema } from "../interfaces/user.interface";
import { hash } from "bcrypt";

const User = model<IUserSchema>(
  "User",
  new Schema({
    name: { type: String, required: true },
    email: { type: String, required: true },
    password: { type: String, required: true },
    farmId: { type: String, required: true },
    token: { type: String, default: null },
    isDisabled: { type: Boolean, default: false },
  }).pre("save", async function (next) {
    // hash the password with salt
    const hashedPassword = await hash(this.password, 10);
    // assign the hashed password to this field
    this.password = hashedPassword;
    next();
  })
);

export default User;
