export const AuditSchema = {
  createdAt: {
    type: Number,
    default: new Date().getTime(),
    select: false,
  },
  createdBy: {
    //createdBy -> from the token
    type: String,
    default: "",
    select: false,
  },
  updatedAt: {
    type: Number,
    default: null,
    select: false,
  },
  updatedBy: {
    //updatedBy -> from the token
    type: String,
    default: null,
    select: false,
  },
  deletedAt: {
    type: Number,
    default: null,
    select: false,
  },
  deletedBy: {
    //updatedBy -> from the token
    type: String,
    default: null,
    select: false,
  },
};
