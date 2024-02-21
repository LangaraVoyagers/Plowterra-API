import { NextFunction, Response, Request } from "express";
import Season from "../models/Season";
import { StatusEnum } from "../models/Season";

function create(req: Request, res: Response, next: NextFunction) {
  const season = new Season({
    name: req.body.name,
    startDate: req.body.startDate,
    endDate: req.body.endDate,
    payrollTimeframe: req.body.payrollTimeframe,
    price: req.body.price,
    // TODO: Add productID, unitID, currencyID
  });

  season
    .save()
    .then((result) => {
      res.status(201).json({
        message: "Season created",
        data: result,
        error: null,
      });
    })
    .catch((error) => {
      res.status(500).json({
        message: "Season not created",
        data: null,
        error,
      });
    });
}

function getAll(req: Request, res: Response, next: NextFunction) {
  Season.find({ deletedAt: null })
    .select("name status startDate endDate")
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

  Season.findById(id)
    .exec()
    .then((results) => {
      res.status(200).json(results);
    })
    .catch((error) => {
      res.status(500).json(error);
    });
}

function close(req: Request, res: Response, next: NextFunction) {
  const id = req.params.id;

  Season.findOneAndUpdate(
    { _id: id },
    { status: StatusEnum.CLOSED, endDate: new Date().getTime() },
    { new: true }
  )
    .exec()
    .then((results) => {
      res.status(200).json({
        message: "Season closed",
        data: results,
        error: null,
      });
    })
    .catch((error) => {
      res.status(500).json({
        message: "Error closing season",
        data: null,
        error,
      });
    });
}

function update(req: Request, res: Response, next: NextFunction) {
  const id = req.params.id;

  Season.findOneAndUpdate({ _id: id }, req.body, { new: true })
    .exec()
    .then((results) => {
      res.status(200).json({
        message: "Season updated",
        data: results,
        error: null,
      });
    })
    .catch((error) => {
      res.status(500).json({
        message: "Error updating season",
        data: null,
        error,
      });
    });
}

function remove(req: Request, res: Response, next: NextFunction) {
  const id = req.params.id;

  Season.findOneAndUpdate(
    { _id: id, hasHarvestLog: false },
    { deletedAt: new Date().getTime() },
    { new: true }
  )
    .exec()
    .then((results) => {
      if (!results) {
        return res
          .status(404)
          .json({
            message: "Can't delete a Season that has a harvest log.",
            data: null,
            error: null,
          });
      } else {
        res.status(200).json({
          message: "Season deleted",
          data: results,
          error: null,
        });
      }
    })
    .catch((error) => {
      res.status(500).json({
        message: "Error deleting season",
        data: null,
        error,
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
