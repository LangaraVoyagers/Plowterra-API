import { SchemaDefinition } from "mongoose";
import { IAudit } from "../interfaces/shared.interface";

export const AuditSchema = {
  createdAt: {
    type: Number,
    default: new Date().getTime(),
  },
  createdBy: {
    //createdBy -> from the token
    type: String,
    default: "",
  },
  updatedAt: {
    type: Number,
    default: null,
  },
  updatedBy: {
    //updatedBy -> from the token
    type: String,
    default: null,
  },
  deletedAt: {
    type: Number,
    default: null,
  },
  deletedBy: {
    //updatedBy -> from the token
    type: String,
    default: null,
  },
};
