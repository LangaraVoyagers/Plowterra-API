import { Request, Response } from "express";
import Unit from "../models/Unit";
import Message from "../shared/Message";
import getContentLocation from "../shared/get-content-location";

const message = new Message("unit");

// POST: /api/v1/units
export function createUnit(req: Request, res: Response) {
  const unit = new Unit({
    name: req?.body?.name,
  });

  unit
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

// GET: /api/v1/units
export function getAllUnit(req: Request, res: Response) {
  Unit.find({ deletedAt: null })
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

// GET: /api/v1/units/:id
export function getUnit(req: Request, res: Response) {
  const id = req?.params?.id;

  Unit.findOne({ _id: id, deletedAt: null })
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

// DELETE: /api/v1/units/:id
export function deleteUnit(req: Request, res: Response) {
  const id = req?.params?.id;

  Unit.findOneAndUpdate(
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
