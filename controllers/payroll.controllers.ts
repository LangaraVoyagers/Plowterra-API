import { NextFunction, Response, Request } from "express";
import Payroll from "../models/Payroll";
import Message from "../shared/Message";

const message = new Message("payroll");

function create() {}

function getAll(req: Request, res: Response, next: NextFunction) {
  Payroll.find({})
    .exec()
    .then((data) => {
      res
        .status(200)
        .json({ data, error: false, message: message.get("success") });
    })
    .catch(() => {
      res.status(500).json({
        data: null,
        error: true,
        message: message.get("error"),
      });
    });
}

function getById(req: Request, res: Response, next: NextFunction) {
  const id = req.params.id;

  Payroll.findOne({ _id: id })
    .exec()
    .then((data) => {
      if (!data) {
        res.status(404).json({
          data,
          error: true,
          message: message.get("not_found"),
        });
        return;
      }

      res
        .status(200)
        .json({ data, error: false, message: message.get("success") });
    })
    .catch(() => {
      res.status(500).json({
        data: null,
        error: true,
        message: message.get("error"),
      });
    });
}

const payrollController = {
  create,
  getAll,
  getById,
};

export default payrollController;
