import { Schema, model } from "mongoose";

import { IUser } from "../interfaces/user.interface";
import { hash } from "bcrypt";

const User = model<IUser>(
  "User",
  new Schema({
    name: { type: String, required: true },
    email: { type: String, required: true },
    password: { type: String, required: true },
    farmId: { type: String, required: true },
    token: { type: String, default: null },
    isDisabled: { type: Boolean, default: false },
  }, { versionKey: false }).pre("save", async function(next) {
    const hashedPassword = await hash(this.password, 10);
    this.password = hashedPassword;
    next();
  })
);

export default User;
