import { NextFunction, Request, Response } from "express";
import Currency from "../models/Currency";
import Message from "../shared/Message";
import getContentLocation from "../shared/get-content-location";

const message = new Message("currency");

function create(req: Request, res: Response, next: NextFunction) {
  const currency = new Currency({
    name: req?.body?.name,
  });

  currency
    .save()
    .then((results) => {
      const url = getContentLocation(req, results._id);

      res
        .set("content-location", url)
        .status(201)
        .json({
          data: results,
          error: false,
          message: message.create("success"),
        });
    })
    .catch(() => {
      res.status(500).json({
        data: null,
        error: true,
        message: message.create("error"),
      });
    });
}

function getAll(req: Request, res: Response, next: NextFunction) {
  Currency.find({ deletedAt: null })
    .exec()
    .then((data) => {
      res.status(200).json({
        data,
        error: false,
        message: message.get("success"),
      });
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
  const id = req?.params?.id;

  Currency.findOne({ _id: id, deletedAt: null })
    .exec()
    .then((data) => {
      if (!data) {
        return res
          .status(404)
          .json({ data, error: true, message: message.get("not_found") });
      }

      res.status(200).json({
        data,
        error: false,
        message: message.get("success"),
      });
    })
    .catch(() => {
      res.status(500).json({
        data: null,
        error: true,
        message: message.get("error"),
      });
    });
}

function remove(req: Request, res: Response, next: NextFunction) {
  const id = req?.params?.id;

  Currency.findOneAndUpdate(
    { _id: id, deletedAt: null },
    {
      deletedAt: new Date().getTime(),
      deletedBy: "",
    },
    {
      returnDocument: "after",
    }
  )
    .exec()
    .then((data) => {
      if (!data) {
        return res
          .status(404)
          .json({ data, error: true, message: message.get("not_found") });
      }

      res.status(200).json({
        data,
        error: false,
        message: message.delete("success"),
      });
    })
    .catch(() => {
      res.status(500).json({
        data: null,
        error: true,
        message: message.delete("error"),
      });
    });
}

const currencyController = {
  create,
  getAll,
  getById,
  remove,
};

export default currencyController;
