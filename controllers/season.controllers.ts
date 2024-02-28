import { NextFunction, Request, Response } from "express";

import Season from "../models/Season";
import { StatusEnum } from "../models/Season";
import getContentLocation from "../shared/get-content-location";
import Message from "../shared/Message";
import Deduction from "../models/Deduction";
import { ISeasonDeductionSchema } from "../interfaces/season.interface";

const message = new Message("harvest season");

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
    // TODO: Add unitID, currencyID
  });

  if (deductions.length) {
    Deduction.find({ deletedAt: null })
      .where("_id")
      .in(deductions.map((d) => d?.deductionID))
      .exec()
      .catch(() => {
        res.status(500).json({
          data: null,
          error: true,
          message: message.create("error"),
        });
      });
  }

  season
    .save()
    .then(async (data) => {
      await data.populate("product");

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
    .populate("product")
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
    .populate("product")
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
    .populate("product")
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

  if (deductions.length) {
    Deduction.find({ deletedAt: null })
      .where("_id")
      .in(deductions.map((d) => d?.deductionID))
      .populate("product")
      .exec()
      .catch(() => {
        res.status(500).json({
          data: null,
          error: true,
          message: message.create("error"),
        });
      });
  }

  Season.findOneAndUpdate({ _id: id }, req.body, {
    returnDocument: "after",
    runValidators: true,
    context: "query",
  })
    .populate("product")
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
    .populate("product")
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
