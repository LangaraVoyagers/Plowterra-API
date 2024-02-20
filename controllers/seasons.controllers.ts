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
        result,
      });
    })
    .catch((error) => {
      res.status(500).json({
        message: "Season not created",
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
    { status: StatusEnum[1], endDate: new Date().getTime() },
    { new: true }
  )
    .exec()
    .then((results) => {
      res.status(200).json(results);
    })
    .catch((error) => {
      res.status(500).json(error);
    });
}

function update(req: Request, res: Response, next: NextFunction) {
  const id = req.params.id;

  Season.findOneAndUpdate({ _id: id }, req.body, { new: true })
    .exec()
    .then((results) => {
      res.status(200).json(results);
    })
    .catch((error) => {
      res.status(500).json(error);
    });
}

function remove(req: Request, res: Response, next: NextFunction) {
  const id = req.params.id;

  Season.findOne({ _id: id, hasHarvestLog: false })
    .exec()
    .then((season) => {
      if (season) {
        Season.findOneAndUpdate(
          { _id: id },
          { deletedAt: new Date().getTime() },
          { new: true }
        )
          .exec()
          .then((results) => {
            res.status(200).json(results);
          })
          .catch((error) => {
            res.status(500).json(error);
          });
      } else {
        res
          .status(400)
          .json({ message: "Cannot delete season with harvest log" });
      }
    })
    .catch((error) => {
      res.status(500).json(error);
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
