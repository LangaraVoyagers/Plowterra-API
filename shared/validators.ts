import { NextFunction, Request, Response } from "express";

import Ajv from "ajv";
import HarvestLogSchema from "project-2-types/dist/ajv";

const ajv = new Ajv();

const harvestLogValidator = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const validate = ajv.compile(HarvestLogSchema);
  const valid = validate(req.body);
  if (!valid) {
    return res.status(400).json(validate.errors);
  }
  next();
};

export default harvestLogValidator;
