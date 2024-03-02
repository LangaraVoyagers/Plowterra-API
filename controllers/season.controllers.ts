import { NextFunction, Request, Response } from "express";

import Season from "../models/Season";
import { StatusEnum } from "../models/Season";
import getContentLocation from "../shared/get-content-location";
import Message from "../shared/Message";
import { ISeasonDeductionSchema } from "../interfaces/season.interface";

const message = new Message("harvest season");

const POPULATE_FIELDS = [
  {
    path: "farm",
    model: "Farm",
    select: "name address",
  },
  "product unit currency",
];

function create(req: Request, res: Response, next: NextFunction) {
  const deductions: Array<ISeasonDeductionSchema> = req.body.deductions ?? [];

  const season = new Season({
    name: req.body.name,
    startDate: req.body.startDate,
    endDate: req.body.endDate,
    payrollTimeframe: req.body.payrollTimeframe,
    price: req.body.price,
    deductions,
    product: req.body.productId,
    unit: req.body.unitId,
    currency: req.body.currencyId,
    farm: req.body.farmId,
  });

  season
    .save()
    .then(async (data) => {
      await data.populate(POPULATE_FIELDS);

      const url = getContentLocation(req, data._id);

      res
        .set("content-location", url)
        .status(201)
        .json({
          data,
          error: false,
          message: message.create("success"),
        });
    })
    .catch((error) => {
      console.log({ error });
      res.status(500).json({
        data: null,
        error: true,
        message: message.create("error"),
      });
    });
}

function getAll(req: Request, res: Response, next: NextFunction) {
  Season.find({ deletedAt: null })
    .select("name status startDate endDate")
    .populate(POPULATE_FIELDS)
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
  const id = req.params.id;

  Season.findById(id)
    .populate(POPULATE_FIELDS)
    .then((data) => {
      if (!data) {
        return res
          .status(404)
          .json({ data, error: true, message: message.get("not_found") });
      }

      res
        .status(200)
        .json({ data, error: false, message: message.get("success") });
    })
    .catch(() => {
      res
        .status(500)
        .json({ data: null, error: true, message: message.get("error") });
    });
}

function close(req: Request, res: Response, next: NextFunction) {
  const id = req.params.id;

  Season.findOneAndUpdate(
    { _id: id, deletedAt: null },
    { status: StatusEnum.CLOSED, endDate: new Date().getTime() },
    { new: true }
  )
    .populate(POPULATE_FIELDS)
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
        message: message.update("success", "closed"),
      });
    })
    .catch(() => {
      res.status(500).json({
        data: null,
        error: true,
        message: message.update("error"),
      });
    });
}

function update(req: Request, res: Response, next: NextFunction) {
  const id = req.params.id;

  const deductions: Array<ISeasonDeductionSchema> = req.body.deductions ?? [];

  const season = {
    name: req.body.name ?? undefined,
    startDate: req.body.startDate ?? undefined,
    endDate: req.body.endDate ?? undefined,
    payrollTimeframe: req.body.payrollTimeframe ?? undefined,
    price: req.body.price ?? undefined,
    deductions,
    product: req.body.productId ?? undefined,
    unit: req.body.unitId ?? undefined,
    currency: req.body.currencyId ?? undefined,
    farm: req.body.farmId ?? undefined,
  };

  Season.findOneAndUpdate({ _id: id }, season, {
    returnDocument: "after",
    runValidators: true,
    context: "query",
  })
    .populate(POPULATE_FIELDS)
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
        message: message.update("success"),
      });
    })
    .catch(() => {
      res.status(500).json({
        data: null,
        error: true,
        message: message.update("error"),
      });
    });
}

function remove(req: Request, res: Response, next: NextFunction) {
  const id = req.params.id;

  Season.findOneAndUpdate(
    { _id: id, hasHarvestLog: false, deletedAt: null },
    { deletedAt: new Date().getTime() },
    { returnDocument: "after" }
  )
    .populate(POPULATE_FIELDS)
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

const seasonController = {
  create,
  getAll,
  getById,
  close,
  update,
  remove,
};

export default seasonController;
