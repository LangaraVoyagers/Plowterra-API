import { NextFunction, Request, Response } from "express";

import Ajv from "ajv";

import addErrors from "ajv-errors";
import addFormats from "ajv-formats";
import addKeywords from "ajv-keywords";

const ajv = new Ajv({
  useDefaults: "empty",
  allErrors: true,
  coerceTypes: true,
});

addFormats(ajv, ["date", "email"]);
addErrors(ajv);
addKeywords(ajv, "transform");

export const validator = (schema: any) => {
  return (req: Request, res: Response, next: NextFunction) => {
    const validate = ajv.compile(schema);
    const valid = validate(req.body);

    if (!valid) {
      return res.status(400).json(validate.errors);
    }
    next();
  };
};

export default validator;
