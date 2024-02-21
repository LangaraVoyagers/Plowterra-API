import { Request } from "express";

const getContentLocation = (req: Request, id: any) => {
  return `${req.originalUrl}/${id}`;
};
export default getContentLocation;