import { Schema, model } from "mongoose";

import { hash } from "bcryptjs";
import { IUserSchema } from "../interfaces/user.interface";

const UserSchema = new Schema({
  name: { type: String, required: true },
  email: { type: String, required: true },
  password: { type: String, required: true },
  farm: { type: Schema.Types.ObjectId, ref: "Farm", required: true },
  token: { type: String, default: null },
  isDisabled: { type: Boolean, default: false },
}).pre("save", async function (next) {
  // hash the password with salt
  const hashedPassword = await hash(this.password, 10);
  // assign the hashed password to this field
  this.password = hashedPassword;
  next();
});

// hide password when converting to JSON
UserSchema.methods.toJSON = function () {
  const userObject = this.toObject();
  delete userObject.password;
  return userObject;
};

const User = model<IUserSchema>("User", UserSchema);

export default User;
