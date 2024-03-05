import Ajv from "ajv";
import { NextFunction, Request, Response } from "express";
import schema from "project-2-types/lib/harvestLog.ajv";

const ajv = new Ajv();

const harvestLogValidator = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const validate = ajv.compile(schema);
  const valid = validate(req.body);
  if (!valid) {
    return res.status(400).json(validate.errors);
  }
  next();
};

export default harvestLogValidator;
