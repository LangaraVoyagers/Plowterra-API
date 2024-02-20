import { NextFunction, Response, Request } from "express";
import Payroll from "../models/Payroll";

function create() {}

function getAll(req: Request, res: Response, next: NextFunction) {
  Payroll.find({})
    .exec()
    .then((results) => {
      res.status(200).json(results);
    })
    .catch((error) => {
      res.status(500).json(error);
    });
}

function getById(req: Request, res: Response, next: NextFunction) {
  const id = req.params.id;

  Payroll.findOne({ _id: id })
    .exec()
    .then((results) => {
      res.status(200).json(results);
    })
    .catch((error) => {
      res.status(500).json(error);
    });
}

const payrollController = {
  create,
  getAll,
  getById,
};

export default payrollController;
